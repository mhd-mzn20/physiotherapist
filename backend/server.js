const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const bcrypt = require('bcrypt')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()
// Pull port from environment (useful for deployment) or fall back to 5001.
const PORT = process.env.PORT || 5001

/* =========================
   MIDDLEWARE
========================= */
app.use(cors())
app.use(express.json())

/* =========================
   CREATE UPLOADS FOLDER
========================= */
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname)
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 120 * 1024 * 1024 }, // 120MB max per file
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      '.mp4', '.mov', '.avi', '.mkv', // videos
      '.csv',                         // CSV files
      '.png', '.jpg', '.jpeg', '.gif' // images
    ]

    const ext = path.extname(file.originalname).toLowerCase()

    if (allowedTypes.includes(ext)) {
      cb(null, true)
    } else {
      cb(
        new Error(
          'Invalid file type. Allowed: videos (.mp4, .mov, .avi, .mkv), CSV (.csv), images (.png, .jpg, .jpeg, .gif)'
        )
      )
    }
  }
})

/* =========================
   NEW MULTER (Specifically for Profile Pictures)
========================= */
const uploadImage = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for photos
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.png', '.jpg', '.jpeg', '.gif'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) cb(null, true);
        else cb(new Error('Only images are allowed for profiles!'), false);
    }
});
/* =========================
   DATABASE CONNECTION
========================= */
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'physiotherapy_db'
})

db.connect(err => {
  if (err) console.error('Database connection failed:', err)
  else console.log('Connected to MySQL')
})

/* =========================
   AUTH ROUTES
========================= */

app.post('/api/users', async (req, res) => {
  const { fullname, email, telephone, username, password, role } = req.body

  if (!fullname || !email || !telephone || !username || !password || !role)
    return res.status(400).json({ message: 'All fields required' })

  db.query(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [username, email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' })
      if (results.length > 0)
        return res.status(409).json({ message: 'Username or email exists' })

      const hashedPassword = await bcrypt.hash(password, 10)

      db.query(
        `INSERT INTO users (fullname, email, telephone, username, password, role)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [fullname, email, telephone, username, hashedPassword, role],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Insert error' })
          res.status(201).json({ userId: result.insertId })
        }
      )
    }
  )
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body; // 'username' comes from the login input field

  // 1. Check 'users' table (Staff)
  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      if (results.length > 0) {
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });
        
        // Response for Staff
        return res.json({ idUser: user.idUser, role: user.role });
      }

      // 2. If no staff found, check 'patients' table
      // We use 'name = ?' because that is your column name
      db.query(
        'SELECT * FROM patients WHERE name = ?',
        [username],
        async (err, patientResults) => {
          if (err) return res.status(500).json({ message: 'Database error' });

          if (patientResults.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
          }

          const patient = patientResults[0];

          // Check for password (skip if NULL in DB)
          if (!patient.password) {
            return res.status(401).json({ message: 'Password not set for this patient' });
          }
          
          const match = await bcrypt.compare(password, patient.password);
          if (!match) return res.status(401).json({ message: 'Invalid credentials' });

          // MAP idpatient -> idUser so the frontend logic doesn't break
          res.json({ idUser: patient.idpatient }); 
        }
      );
    }
  );
});
app.get('/api/users/:idUser', (req, res) => {
  db.query(
    'SELECT fullname FROM users WHERE idUser = ?',
    [req.params.idUser],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' })
      if (result.length === 0)
        return res.status(404).json({ message: 'User not found' })

      res.json(result[0])
    }
  )
})
// GET all users
app.get('/api/users', (req, res) => {
  db.query("SELECT * FROM users  ", (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result)
  })
})

// DELETE user
app.delete('/api/users/:id', (req, res) => {
  db.query(
    'DELETE FROM users WHERE idUser = ?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err)
      res.json({ message: 'User deleted' })
    }
  )
})
//update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { fullname, email, telephone, username, password, role } = req.body

    let sql
    let values

    if (password && password.trim() !== '') {
      // If new password provided → hash it
      const hashedPassword = await bcrypt.hash(password, 10)

      sql = `
        UPDATE users 
        SET fullname=?, email=?, telephone=?, username=?, password=?, role=? 
        WHERE idUser=?
      `

      values = [fullname, email, telephone, username, hashedPassword, role, req.params.id]
    } else {
      // If password empty → do NOT change password
      sql = `
        UPDATE users 
        SET fullname=?, email=?, telephone=?, username=?, role=? 
        WHERE idUser=?
      `

      values = [fullname, email, telephone, username, role, req.params.id]
    }

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ message: 'Database error' })
      }

      res.json({ message: 'User updated successfully' })
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})


/* =========================
   PATIENT ROUTES
========================= */

app.get('/api/patients/:idUser', (req, res) => {
    // We join patients with appointments to filter by status and physiotherapist
    const sql = `
        SELECT DISTINCT p.* FROM patients p
        JOIN appointement a ON p.idpatient = a.idpatient
        WHERE a.idUser = ? AND a.status = 'accepted'
    `;
    
    db.query(sql, [req.params.idUser], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(result);
    });
});

app.get('/api/patients/details/:idpatient', (req, res) => {
  db.query(
    'SELECT * FROM patients WHERE idpatient = ?',
    [req.params.idpatient],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' })
      if (result.length === 0)
        return res.status(404).json({ message: 'Patient not found' })

      res.json(result[0])
    }
  )
})

/* =========================
   SESSIONS ROUTES
========================= */


app.post('/api/sessions', upload.array('videos', 10), (req, res) => {
  const { idphysiotherapist, idpatient, sessiondate, test, protocol, remark } =
    req.body

  if (!idphysiotherapist || !idpatient || !sessiondate || !test)
    return res.status(400).json({ message: 'Required fields missing' })

  db.query(
    `INSERT INTO sessions (idphysiotherapist, idpatient, sessiondate, test, protocol, remark)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [idphysiotherapist, idpatient, sessiondate, test, protocol || null, remark || null],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: 'Session insert error' })

      const sessionId = result.insertId

      if (req.files && req.files.length > 0) {
        const videoValues = req.files.map(file => [
          sessionId,
          file.filename
        ])

        db.query(
          'INSERT INTO session_videos (idsession, filename) VALUES ?',
          [videoValues],
          err2 => {
            if (err2)
              return res.status(500).json({ message: 'Video insert error' })

            res.status(201).json({ message: 'Session created', sessionId })
          }
        )
      } else {
        res.status(201).json({ message: 'Session created', sessionId })
      }
    }
  )
})

app.delete('/api/sessions/:idsession', (req, res) => {
  // simple role check – client must send the user's role as a header
  // (session handling / JWT would be better but outside current scope)
  const role = (req.get('x-user-role') || '').toLowerCase();
  if (role === 'biomedical_engineer') {
    return res.status(403).json({ message: 'Biomedical engineers are not allowed to delete sessions' });
  }

  db.query(
    'DELETE FROM sessions WHERE idsession = ?',
    [req.params.idsession],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' })
      if (result.affectedRows === 0)
        return res.status(404).json({ message: 'Session not found' })

      res.json({ message: 'Session deleted successfully' })
    }
  )
})


/* =========================
   CREATE NEW PATIENT
   Adds a new patient linked to a physiotherapist.
========================= */
app.post('/api/patients', (req, res) => {
  const { name, birthdate, sex, diagnostic, idphysiotherapist } = req.body

  if (!name || !birthdate || !sex || !diagnostic || !idphysiotherapist) {
    return res.status(400).json({ message: 'All patient fields are required' })
  }

  const sql = `
    INSERT INTO patients (name, birthdate, sexe, diagnostic, idphysiotherapist)
    VALUES (?, ?, ?, ?, ?)
  `

  db.query(
    sql,
    [name, birthdate, sex, diagnostic, idphysiotherapist],
    (err, result) => {
      if (err) {
        console.error(err)
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        })
      }

      res.status(201).json({
        success: true,
        message: 'Patient added successfully',
        patientId: result.insertId
      })
    }
  )
})

/* =========================
   UPDATE PATIENT
   Updates patient information by id.
========================= */
app.put('/api/patients/:id', (req, res) => {
  const { name, birthdate, sexe, diagnostic } = req.body

  if (!name || !birthdate || !sexe || !diagnostic) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const sql = `
    UPDATE patients
    SET name = ?, birthdate = ?, sexe = ?, diagnostic = ?
    WHERE idpatient = ?
  `

  db.query(
    sql,
    [name, birthdate, sexe, diagnostic, req.params.id],
    (err, result) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ message: 'Database error' })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Patient not found' })
      }

      res.json({ message: 'Patient updated successfully' })
    }
  )
})

/* =========================
   DELETE PATIENT
   Deletes a patient by id.
========================= */
app.delete('/api/patients/:id', (req, res) => {
  db.query(
    'DELETE FROM patients WHERE idpatient = ?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err)
      res.json({ message: 'Patient deleted' })
    }
  )
})

/* =========================
   GET PATIENTS FOR BIOMEDICAL ENGINEER
   Returns patients linked through collaborations table.
/* =========================
   GET SESSIONS WITH VIDEOS + PHYSIOTHERAPIST NAME
========================= */
app.get('/api/sessions/:idpatient', (req, res) => {
  const sql = `
    SELECT 
      s.*, 
      u.fullname AS physiotherapist_name,
      GROUP_CONCAT(v.filename) AS videos_filenames
    FROM sessions s
    LEFT JOIN session_videos v ON s.idsession = v.idsession
    LEFT JOIN users u ON s.idphysiotherapist = u.idUser
    WHERE s.idpatient = ?
    GROUP BY s.idsession
    ORDER BY s.sessiondate DESC
  `

  db.query(sql, [req.params.idpatient], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' })

    const sessions = results.map(session => ({
      ...session,
      videos: session.videos_filenames
        ? session.videos_filenames.split(',')
        : []
    }))

    res.json(sessions)
  })
})

// GET users by role
app.get('/api/users/role/:role', (req, res) => {
  const role = req.params.role;

  let query;
  let params;

  if (role === 'biomedical_engineer') {
    query = `
      SELECT idUser, fullname 
      FROM users 
      WHERE role IN (?, ?)
    `;
    params = ['biomedical_engineer', 'admin'];
  } else {
    query = `
      SELECT idUser, fullname 
      FROM users 
      WHERE role = ?
    `;
    params = [role];
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
});

// GET collaborations for one biomedical engineer
app.get('/api/collaborations/:idBiomedical', (req, res) => {
  db.query(
    'SELECT idphysiotherapist FROM collaborations WHERE idbiomedicalengineer = ?',
    [req.params.idBiomedical],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json(results);
    }
  );
});
// Delete collaboration
app.delete('/api/collaborations', (req, res) => {
  const { idbiomedicalengineer, idphysiotherapist } = req.body;

  const sql = `
    DELETE FROM collaborations
    WHERE idbiomedicalengineer = ? AND idphysiotherapist = ?
  `;

  db.query(sql, [idbiomedicalengineer, idphysiotherapist], (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Deleted successfully' });
  });
});


// 1️⃣ Get all collaborations
app.get("/api/collaborations", (req, res) => {
  const sql = `
    SELECT c.idphysiotherapist, c.idbiomedicalengineer, u.fullname AS engName
    FROM collaborations c
    JOIN users u ON c.idbiomedicalengineer = u.idUser
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// 2️⃣ Get physios assigned to a biomedical engineer
app.get("/api/collaborations/engineer/:idBiomedical", (req, res) => {
  const id = req.params.idBiomedical;
  db.query(
    "SELECT idphysiotherapist FROM collaborations WHERE idbiomedicalengineer = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

// 3️⃣ Save collaborations (delete previous, insert new)
app.post("/api/collaborations", (req, res) => {
  const { idBiomedical, idPhysios } = req.body;

  db.query(
    "DELETE FROM collaborations WHERE idbiomedicalengineer = ?",
    [idBiomedical],
    (err) => {
      if (err) return res.status(500).json(err);

      if (!idPhysios || idPhysios.length === 0) return res.json({ message: "Updated" });

      const values = idPhysios.map((p) => [idBiomedical, p]);
      db.query(
        "INSERT INTO collaborations (idbiomedicalengineer, idphysiotherapist) VALUES ?",
        [values],
        (err2) => {
          if (err2) return res.status(500).json(err2);
          res.json({ message: "Saved successfully" });
        }
      );
    }
  );
});



/* =========================
   GET PATIENTS FOR BIOMEDICAL ENGINEER
   Returns patients with physiotherapist ID for navigation
========================= */
app.get('/api/biomedical-patients/:idBiomedical', (req, res) => {
  const biomedicalId = req.params.idBiomedical;

  const sql = `
  SELECT DISTINCT
    p.idpatient,
    p.name,
    p.birthdate,
    p.sexe,
    p.diagnostic,
    a.idUser AS idphysiotherapist
FROM patients p
INNER JOIN appointement a ON p.idpatient = a.idpatient
INNER JOIN collaborations c ON a.idUser = c.idphysiotherapist
WHERE c.idbiomedicalengineer = ?
  AND a.status = 'accepted';
  `;

  db.query(sql, [biomedicalId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
/* =========================
   UPDATE SESSION
========================= */
app.put('/api/sessions/:idsession', upload.array('videos', 10), (req, res) => {
  const sessionId = req.params.idsession
  const { sessiondate, test, protocol, remark } = req.body

  if (!sessiondate || !test) {
    return res.status(400).json({ message: 'Required fields missing' })
  }

  // 1️⃣ Update session info
  const updateSql = `
    UPDATE sessions
    SET sessiondate = ?, test = ?, protocol = ?, remark = ?
    WHERE idsession = ?
  `

  db.query(
    updateSql,
    [sessiondate, test, protocol || null, remark || null, sessionId],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: 'Session update error' })

      if (result.affectedRows === 0)
        return res.status(404).json({ message: 'Session not found' })

      // 2️⃣ If NO new videos uploaded → keep old videos
      if (!req.files || req.files.length === 0) {
        return res.json({ message: 'Session updated (videos unchanged)' })
      }

      // 3️⃣ If new videos uploaded → delete old videos

      // Get old filenames first
      db.query(
        'SELECT filename FROM session_videos WHERE idsession = ?',
        [sessionId],
        (err2, oldVideos) => {
          if (err2)
            return res.status(500).json({ message: 'Error fetching old videos' })

          // Delete files from uploads folder
          oldVideos.forEach(video => {
            const filePath = path.join(uploadsDir, video.filename)
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath)
            }
          })

          // Delete records from session_videos
          db.query(
            'DELETE FROM session_videos WHERE idsession = ?',
            [sessionId],
            err3 => {
              if (err3)
                return res.status(500).json({ message: 'Error deleting old videos' })

              // 4️⃣ Insert new uploaded videos
              const videoValues = req.files.map(file => [
                sessionId,
                file.filename
              ])

              db.query(
                'INSERT INTO session_videos (idsession, filename) VALUES ?',
                [videoValues],
                err4 => {
                  if (err4)
                    return res.status(500).json({ message: 'Error inserting new videos' })

                  res.json({ message: 'Session and videos updated successfully' })
                }
              )
            }
          )
        }
      )
    }
  )
})

/* =========================
   VIDEO STREAMING (MP4)
========================= */

app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename)

  if (!fs.existsSync(filePath))
    return res.status(404).send('File not found')

  const stat = fs.statSync(filePath)
  const fileSize = stat.size
  const range = req.headers.range

  // Detect correct MIME type automatically
  const mimeType = require('mime-types').lookup(filePath) || 'application/octet-stream'

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    const chunkSize = end - start + 1

    const file = fs.createReadStream(filePath, { start, end })

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': mimeType
    })

    file.pipe(res)
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': mimeType
    })

    fs.createReadStream(filePath).pipe(res)
  }
})
/* =========================
   BIOMEDICAL ROUTES
========================= */

app.post(
  '/api/biomedical',
  upload.fields([
    { name: 'csvFiles', maxCount: 10 },
    { name: 'graphImages', maxCount: 10 }
  ]),
  (req, res) => {
    const {
      idengineer,
      idphysiotherapist,
      idpatient,
      visitdate,
      testtype,
      testvalue,
      note
    } = req.body

    if (!idengineer || !idpatient || !visitdate || !testtype) {
      return res.status(400).json({ message: 'Required fields missing' })
    }

    const insertBiomedical = `
      INSERT INTO biomedical
      (idengineer, idphysiotherapist, idpatient, visitdate, testtype, testvalue, note)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `

    db.query(
      insertBiomedical,
      [
        idengineer,
        idphysiotherapist || null,
        idpatient,
        visitdate,
        testtype,
        testvalue || null,
        note || null
      ],
      (err, result) => {
        if (err) {
          console.error(err)
          return res.status(500).json({ message: 'Database error' })
        }

        const biomedicalId = result.insertId
        const filesToInsert = []

        // CSV Files
        if (req.files?.csvFiles) {
          req.files.csvFiles.forEach(file => {
            filesToInsert.push([biomedicalId, file.filename, 'csv'])
          })
        }

        // Image Files
        if (req.files?.graphImages) {
          req.files.graphImages.forEach(file => {
            filesToInsert.push([biomedicalId, file.filename, 'image'])
          })
        }

        if (filesToInsert.length === 0) {
          return res.status(201).json({ message: 'Biomedical record created' })
        }

        db.query(
          'INSERT INTO biomedical_files (idbiomedical, filename, filetype) VALUES ?',
          [filesToInsert],
          err2 => {
            if (err2)
              return res.status(500).json({ message: 'File insert error' })

            res.status(201).json({
              message: 'Biomedical record created successfully'
            })
          }
        )
      }
    )
  }
)
//GET BIOMEDICAL RECORDS (Grouped)
app.get('/api/biomedical/:idpatient', (req, res) => {
  const sql = `
    SELECT 
      b.*,
      u.fullname AS engineer_name,
      f.idfile,
      f.filename,
      f.filetype
    FROM biomedical b
    LEFT JOIN users u ON b.idengineer = u.idUser
    LEFT JOIN biomedical_files f ON b.idbiomedical = f.idbiomedical
    WHERE b.idpatient = ?
    ORDER BY b.visitdate DESC
  `

  db.query(sql, [req.params.idpatient], (err, results) => {
    if (err)
      return res.status(500).json({ message: 'Database error' })

    const grouped = {}

    results.forEach(row => {
      if (!grouped[row.idbiomedical]) {
        grouped[row.idbiomedical] = {
          idbiomedical: row.idbiomedical,
          visitdate: row.visitdate,
          testtype: row.testtype,
          testvalue: row.testvalue,
          note: row.note,
          engineer_name: row.engineer_name,
          files: []
        }
      }

      if (row.idfile) {
        grouped[row.idbiomedical].files.push({
          idfile: row.idfile,
          filename: row.filename,
          filetype: row.filetype
        })
      }
    })

    res.json(Object.values(grouped))
  })
})
//delete biomedical record
// DELETE biomedical record + files
app.delete('/api/biomedical/:id', (req, res) => {
  const biomedicalId = req.params.id

  // 1️⃣ Get all associated files
  db.query(
    'SELECT filename FROM biomedical_files WHERE idbiomedical = ?',
    [biomedicalId],
    (err, files) => {
      if (err) return res.status(500).json({ message: 'Database error' })

      // 2️⃣ Delete files from uploads folder
      files.forEach(file => {
        const filePath = path.join(uploadsDir, file.filename)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      })

      // 3️⃣ Delete file records from biomedical_files table
      db.query(
        'DELETE FROM biomedical_files WHERE idbiomedical = ?',
        [biomedicalId],
        err2 => {
          if (err2) return res.status(500).json({ message: 'File delete error' })

          // 4️⃣ Delete biomedical record itself
          db.query(
            'DELETE FROM biomedical WHERE idbiomedical = ?',
            [biomedicalId],
            (err3, result) => {
              if (err3) return res.status(500).json({ message: 'Record delete error' })
              if (result.affectedRows === 0) return res.status(404).json({ message: 'Record not found' })
              res.json({ message: 'Biomedical record and associated files deleted successfully' })
            }
          )
        }
      )
    }
  )
})

//delete single file
app.delete('/api/biomedical/file/:idfile', (req, res) => {
  const idfile = req.params.idfile

  db.query(
    'SELECT filename FROM biomedical_files WHERE idfile = ?',
    [idfile],
    (err, result) => {
      if (err || result.length === 0)
        return res.status(404).json({ message: 'File not found' })

      const filename = result[0].filename
      const filePath = path.join(uploadsDir, filename)

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }

      db.query(
        'DELETE FROM biomedical_files WHERE idfile = ?',
        [idfile],
        err2 => {
          if (err2)
            return res.status(500).json({ message: 'Delete error' })

          res.json({ message: 'File deleted successfully' })
        }
      )
    }
  )
})
// UPDATE biomedical record
app.put(
  '/api/biomedical/:id',
  upload.fields([
    { name: 'csvFiles', maxCount: 10 },
    { name: 'graphImages', maxCount: 10 }
  ]),
  (req, res) => {
    const { id } = req.params
    const { visitdate, testtype, testvalue, note } = req.body

    // 1️⃣ Update main biomedical info
    const updateSql = `
      UPDATE biomedical
      SET visitdate = ?, testtype = ?, testvalue = ?, note = ?
      WHERE idbiomedical = ?
    `

    db.query(
      updateSql,
      [visitdate, testtype, testvalue || null, note || null, id],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Update error' })

        // 2️⃣ If files uploaded, add them
        const filesToInsert = []

        if (req.files?.csvFiles) {
          req.files.csvFiles.forEach(file => {
            filesToInsert.push([id, file.filename, 'csv'])
          })
        }

        if (req.files?.graphImages) {
          req.files.graphImages.forEach(file => {
            filesToInsert.push([id, file.filename, 'image'])
          })
        }

        if (filesToInsert.length === 0) {
          return res.json({ message: 'Record updated successfully' })
        }

        db.query(
          'INSERT INTO biomedical_files (idbiomedical, filename, filetype) VALUES ?',
          [filesToInsert],
          err2 => {
            if (err2) return res.status(500).json({ message: 'File insert error' })

            res.json({ message: 'Record and files updated successfully' })
          }
        )
      }
    )
  }
)

/* =========================
   AVAILABILITY ROUTES
   Add or edit availability for a physiotherapist.
========================= */
// 1. Fetch Availability for a specific user
app.get('/api/availability/:idUser', (req, res) => {
    const { idUser } = req.params;
    // We only select slots where the status is 'available'
    const sql = "SELECT * FROM availability WHERE idUser = ? AND status = 'available'";
    
    db.query(sql, [idUser], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 2. The Toggle Route (Add if missing, Delete if exists)
// Updated Toggle Route with Role Verification
app.post('/api/availability/toggle', (req, res) => {
    const { idUser, available_date, start_time } = req.body;

    // First, verify this user actually exists and is a physiotherapist
    const roleCheckSql = "SELECT role FROM users WHERE idUser = ?";
    
    db.query(roleCheckSql, [idUser], (err, userResult) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (userResult.length === 0 || userResult[0].role !== 'physiotherapist') {
            return res.status(403).json({ message: "Forbidden: Unauthorized role." });
        }

        // If role is correct, proceed with the existing toggle logic
        const checkSql = "SELECT * FROM availability WHERE idUser = ? AND available_date = ? AND start_time = ?";
        
        db.query(checkSql, [idUser, available_date, start_time], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (result.length > 0) {
                // DELETE logic
                const deleteSql = "DELETE FROM availability WHERE idUser = ? AND available_date = ? AND start_time = ?";
                db.query(deleteSql, [idUser, available_date, start_time], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: "Slot removed", status: 'off' });
                });
            } else {
                // INSERT logic
                const insertSql = "INSERT INTO availability (idUser, available_date, start_time, end_time, status) VALUES (?, ?, ?, '00:00:00', 'available')";
                db.query(insertSql, [idUser, available_date, start_time], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: "Slot added", status: 'on' });
                });
            }
        });
    });
});




// Get all appointments for a specific physiotherapist
app.get('/api/physio-appointments/:idUser', (req, res) => {
    const { idUser } = req.params;
    
    const sql = `
        SELECT 
            a.idBooking, 
            a.status, 
            a.appointment_time, 
            p.name AS patientName, 
            p.diagnostic, 
            i.payment_status, 
            i.payment_method,
            v.available_date
        FROM appointement a
        LEFT JOIN patients p ON a.idpatient = p.idpatient
        LEFT JOIN invoice i ON a.idBooking = i.idBooking
        LEFT JOIN availability v ON a.idAvailability = v.idAvailability
        WHERE a.idUser = ?
        ORDER BY a.idBooking DESC`;

    db.query(sql, [idUser], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Query failed", details: err });
        }
        res.json(results || []); 
    });
});

// Route to update appointment status
app.post('/api/update-appointment-status', (req, res) => {
    const { idBooking, status } = req.body;

    if (!idBooking || !status) {
        return res.status(400).json({ error: "Missing data" });
    }

    // 1. Update the appointment status first
    const updateAppSql = "UPDATE appointement SET status = ? WHERE idBooking = ?";
    
    db.query(updateAppSql, [status, idBooking], (err, result) => {
        if (err) {
            console.error("Error updating appointment:", err);
            return res.status(500).json({ error: err.message });
        }

        // 2. If accepted, sync the specialist to the patient record
        if (status === 'accepted') {
            // Get the IDs from the appointment we just updated
            const findInfoSql = "SELECT idpatient, idUser FROM appointement WHERE idBooking = ?";
            
            db.query(findInfoSql, [idBooking], (err, rows) => {
                if (err || rows.length === 0) return res.json({ success: true });

                const { idpatient, idUser } = rows[0];

                // 3. FIX: Use 'idphysiotherapist' as the column name here
                const updatePatientSql = "UPDATE patients SET idphysiotherapist = ? WHERE idpatient = ?";
                
                db.query(updatePatientSql, [idUser, idpatient], (err) => {
                    if (err) {
                        console.error("Could not link patient to physio:", err);
                        // Still return success for the appointment status even if this link fails
                    }
                    res.json({ success: true, message: "Appointment accepted and patient assigned to specialist." });
                });
            });
        } else {
            res.json({ success: true, message: `Appointment ${status}` });
        }
    });
});

// Get Profile
app.get('/api/profile/:idUser', (req, res) => {
    const sql = `
        SELECT u.fullname, u.email, u.telephone, 
               p.bio, p.service, p.experience, p.image, p.rating
        FROM users u
        LEFT JOIN profile p ON u.idUser = p.idUser
        WHERE u.idUser = ?`;
    
    db.query(sql, [req.params.idUser], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0] || {}); // Send the profile object
    });
});



// Update Bio and Image
app.post('/api/update-profile-details', upload.single('profileImage'), (req, res) => {
  const { idUser, fullname, experience, bio, telephone } = req.body;

  // 1️⃣ Get current image first
  const getImageSql = `SELECT image FROM profile WHERE idUser = ?`;

  db.query(getImageSql, [idUser], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    let currentImage = results[0]?.image || null;

    // 2️⃣ Decide which image to use
    const newImage = req.file ? req.file.filename : currentImage;

    // 3️⃣ Update WITHOUT losing image
    const updateSql = `
      UPDATE profile 
      SET bio = ?, experience = ?, image = ?
      WHERE idUser = ?
    `;

    db.query(updateSql, [bio, experience, newImage, idUser], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // optional: update user table too
      const userSql = `
        UPDATE users 
        SET fullname = ?, telephone = ?
        WHERE idUser = ?
      `;

      db.query(userSql, [fullname, telephone, idUser], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });

        res.json({ message: "Profile updated successfully" });
      });
    });
  });
});

/* ====================================================================================================================================
  patient
========================= ==============================================*/

app.post('/api/register-patient', async (req, res) => {
  const { name, birthdate, sexe, password } = req.body;

  // 1. Validation for the specific columns in your SQL
  if (!name || !birthdate || !sexe || !password) {
    return res.status(400).json({ message: 'All fields (Name, Birthdate, Sexe, Password) are required' });
  }

  // 2. Convert 'Male'/'Female' strings to the tinyint (1/2) your table uses
  const sexeValue = sexe === 'Male' ? 1 : 2;

  db.query(
    'SELECT * FROM patients WHERE name = ?',
    [name],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (results.length > 0) {
        return res.status(409).json({ message: 'Patient name already exists' });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Insert matching your SQL schema: name, birthdate, sexe, password
        // Note: 'diagnostic' and 'idphysiotherapist' are left as default/NULL initially
        const sql = `INSERT INTO patients (name, birthdate, sexe, password, diagnostic) VALUES (?, ?, ?, ?, 'Not assigned')`;
        
        db.query(sql, [name, birthdate, sexeValue, hashedPassword], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Insert error. Check column types.' });
          }
          res.status(201).json({ message: 'Registration successful', patientId: result.insertId });
        });
      } catch (error) {
        res.status(500).json({ message: 'Encryption failed' });
      }
    }
  );
});


//get patient

app.get('/patients/:idpatient', (req, res) => {
  const { idpatient } = req.params;
  
  db.query(
    'SELECT name FROM patients WHERE idpatient = ?',
    [idpatient],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      
      res.json(result[0]);
    }
  );
});

app.get('/physio', (req, res) => {
  const sql = `
    SELECT u.idUser, u.fullname, p.rating, p.image, 
           GROUP_CONCAT(s.title SEPARATOR ', ') AS servicesList
    FROM users u
    LEFT JOIN profile p ON u.idUser = p.idUser
    LEFT JOIN physio_services ps ON u.idUser = ps.idUser
    LEFT JOIN services s ON ps.idService = s.idService
    WHERE u.role = 'physiotherapist'
    GROUP BY u.idUser`;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
});


// 2. Fetch Active Appointments for the Patient
app.get('/api/patient-active-appointments/:idpatient', (req, res) => {
  const sql = `
    SELECT a.idUser AS physioId, u.fullname AS physioName 
    FROM appointement a
    JOIN users u ON a.idUser = u.idUser
    WHERE a.idpatient = ? AND (a.status = 'pending' OR a.status = 'accepted')`;
    
  db.query(sql, [req.params.idpatient], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(result);
  });
});

/* =========================
   APPOINTMENT ROUTES
   Book an appointment based on availability.
========================= */

app.post('/api/book-appointment', (req, res) => {
    const { idpatient, idUser, idAvailability, appointment_time, injuryName, injuryDate } = req.body;

    // 1. Insert the Appointment
    const sqlAppoint = `INSERT INTO appointement (idpatient, idUser, idAvailability, status, appointment_time) VALUES (?, ?, ?, 'pending', ?)`;
    
    db.query(sqlAppoint, [idpatient, idUser, idAvailability, appointment_time], (err, result) => {
        if (err) return res.status(500).json({ error: "Booking failed" });

        // 2. Insert the Injury Record
        const sqlInjury = `INSERT INTO injury (idpatient, injury_name, injury_date) VALUES (?, ?, ?)`;
        
        db.query(sqlInjury, [idpatient, injuryName, injuryDate], (err2) => {
            if (err2) console.error("Injury insert failed:", err2);

            // 3. Mark the slot as booked
            const sqlUpdate = "UPDATE availability SET status = 'booked' WHERE idAvailability = ?";
            db.query(sqlUpdate, [idAvailability], (err3) => {
                res.json({ success: true });
            });
        });
    });
});


/* =========================
   CONFIRM BOOKING + PAYMENT
   After patient confirms booking and chooses payment method.
========================= */


app.post('/api/confirm-booking-payment', (req, res) => {
    // 1. Get the new injury fields from the request body
    const { 
        idpatient, 
        idUser, 
        idAvailability, 
        diagnostic, 
        appointment_time, 
        payment_method, 
        amount,
        injuryName, 
        injuryDate  
    } = req.body;

    // 1. Update Patient Diagnostic (Existing logic)
    db.query("UPDATE patients SET diagnostic = ? WHERE idpatient = ?", [diagnostic, idpatient], (err) => {
        if (err) return res.status(500).send(err);

        // 2. INSERT INTO INJURY TABLE (New logic)
        const injurySql = "INSERT INTO injury (idpatient, injury_name, injury_date) VALUES (?, ?, ?)";
        db.query(injurySql, [idpatient, injuryName, injuryDate], (errInj) => {
            if (errInj) {
                console.error("Injury Insert Error:", errInj);
                // We continue even if injury fails so the booking isn't blocked, 
                // or you can return an error here if it's mandatory.
            }

            // 3. Create Appointment (Existing logic)
            const appSql = `
                INSERT INTO appointement (idpatient, idUser, idAvailability, appointment_time, status) 
                VALUES (?, ?, ?, ?, 'pending')`;
            
            db.query(appSql, [idpatient, idUser, idAvailability, appointment_time], (err, result) => {
                if (err) return res.status(500).send(err);

                const idBooking = result.insertId;
                const payStatus = payment_method === 'online' ? 'paid' : 'pending';

                // 4. Create Invoice (Existing logic)
                const invSql = "INSERT INTO invoice (idBooking, amount, payment_method, payment_status) VALUES (?, ?, ?, ?)";
                db.query(invSql, [idBooking, amount, payment_method, payStatus], (err) => {
                    if (err) return res.status(500).send(err);

                    // 5. Mark slot as Booked (Existing logic)
                    db.query("UPDATE availability SET status = 'booked' WHERE idAvailability = ?", [idAvailability], (errSlot) => {
                        if (errSlot) return res.status(500).send(errSlot);
                        res.status(200).json({ success: true });
                    });
                });
            });
        });
    });
});


/* =========================
   GET PATIENT RESERVATIONS
   Fetch all appointments for a patient with physio details.
========================= */
app.get('/api/patient-reservations/:idpatient', (req, res) => {
    const { idpatient } = req.params;

    const sql = `
       SELECT 
            a.idBooking, 
            a.status, 
            v.start_time, 
            u.fullname AS physioName, 
            s.title AS serviceName,
            ps.idService AS physioServiceId,
            u.idUser AS idUser,
            p.image AS physioImage,
            v.available_date
        FROM appointement a
        JOIN users u ON a.idUser = u.idUser
        JOIN availability v ON a.idAvailability = v.idAvailability
        JOIN physio_services ps ON u.idUser = ps.idUser
        JOIN services s ON ps.idService = s.idService
        LEFT JOIN profile p ON u.idUser = p.idUser
        WHERE a.idpatient = ?
        ORDER BY v.available_date DESC, v.start_time DESC`;

    db.query(sql, [idpatient], (err, results) => {
        if (err) {
            // Check your terminal/console to see the exact SQL error message
            console.error("Database Error:", err); 
            return res.status(500).json({ error: "Failed to fetch reservations", details: err.message });
        }
        res.json(results);
    });
});


// Get Session History and Details for a specific Booking
app.get('/api/session-history/:idBooking', (req, res) => {
    const { idBooking } = req.params;

    const sql = `
        SELECT 
            s.idsession,
            s.sessiondate AS date, 
            s.test AS test_assessment, 
            s.protocol AS protocol_exercise, 
            s.remark,
            u.idUser,           -- <--- ADD THIS LINE HERE
            u.fullname AS physioName, 
            p.service AS physioSpecialty, 
            p.image AS physioImage,
            p.rating
        FROM sessions s
        JOIN appointement a ON s.idpatient = a.idpatient AND s.idphysiotherapist = a.idUser
        JOIN users u ON a.idUser = u.idUser
        LEFT JOIN profile p ON u.idUser = p.idUser
        WHERE a.idBooking = ? 
        ORDER BY s.sessiondate DESC`;

    db.query(sql, [idBooking], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
// Rate Physiotherapist and Update Average Rating

app.post('/api/rate-physio', (req, res) => {
    const { idUser, idpatient, rating, comment } = req.body;

    console.log("Received Rating Data:", { idUser, idpatient, rating, comment });

    if (!idUser || !idpatient || !rating) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. FIRST: Check if the user has already rated this physiotherapist
    const checkSql = "SELECT * FROM evaluation WHERE idUser = ? AND idpatient = ?";
    
    db.query(checkSql, [idUser, idpatient], (errCheck, results) => {
        if (errCheck) return res.status(500).json({ error: errCheck.sqlMessage });

        if (results.length > 0) {
            // User has already rated this person
            return res.status(400).json({ 
                success: false, 
                message: "You have already submitted a rating for this specialist." 
            });
        }

        // 2. SECOND: Proceed with Insertion if no record was found
        const insertSql = "INSERT INTO evaluation (idUser, idpatient, rating, comment) VALUES (?, ?, ?, ?)";
        
        db.query(insertSql, [idUser, idpatient, rating, comment], (err) => {
            if (err) {
                console.error("SQL Error during Insert:", err.sqlMessage);
                return res.status(500).json({ error: err.sqlMessage  });
            }

            // 3. THIRD: Calculate the average
            const avgSql = "SELECT AVG(rating) as avgRating FROM evaluation WHERE idUser = ?";
            db.query(avgSql, [idUser], (err2, resultsAvg) => {
                if (err2) return res.status(500).json({ error: err2.sqlMessage });

                const newAverage = resultsAvg[0].avgRating || 0;

                // 4. FOURTH: Update the users table
                const updateUserSql = "UPDATE users SET rating = ? WHERE idUser = ?";
                db.query(updateUserSql, [newAverage, idUser], (err3) => {
                    if (err3) return res.status(500).json({ error: err3.sqlMessage });
                    
                    res.json({ success: true, newAverage });
                });
            });
        });
    });
});

// Get All Services 

app.get('/api/services', (req, res) => {
    const sql = "SELECT * FROM services";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(results);
    });
});


// GET: Fetch services with prices for a specific physio
app.get('/api/physio-services/:idUser', (req, res) => {
    const sql = `SELECT ps.idService, ps.price, s.title 
                 FROM physio_services ps
                 JOIN services s ON ps.idService = s.idService
                 WHERE ps.idUser = ?`;
    db.query(sql, [req.params.idUser], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results); // Returns array of objects: {idService, price, title}
    });
});

// POST: Save/Update services and their prices
app.post('/api/update-physio-services', (req, res) => {
  const { idUser, services } = req.body;

  const deleteSql = `DELETE FROM physio_services WHERE idUser = ?`;

  db.query(deleteSql, [idUser], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!services || services.length === 0) {
      return res.json({ message: "Services cleared" });
    }

    const insertSql = `INSERT INTO physio_services (idUser, idService, price) VALUES ?`;

    const values = services.map(s => [idUser, s.idService, s.price]);

    db.query(insertSql, [values], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      res.json({ message: "Services updated" });
    });
  });
});
/* =========================
   START SERVER
========================= */

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
)
