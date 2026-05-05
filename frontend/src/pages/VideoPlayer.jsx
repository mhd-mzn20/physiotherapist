import { useParams, useNavigate } from 'react-router-dom'

import '../styles/components.css'
import '../styles/video-player.css'

function VideoPlayer() {
  const { filename } = useParams()
  const navigate = useNavigate()

  return (
    <>
      
      <div className="container page-video-player">
        <h2>Video Player</h2>
        <p><strong>File:</strong> {filename}</p>

        <video controls width="600">
          <source
            src={`http://localhost:5001/uploads/${filename}`}
          />
          Your browser does not support the video tag.
        </video>

      </div>
   
    </>
  )
}

export default VideoPlayer
