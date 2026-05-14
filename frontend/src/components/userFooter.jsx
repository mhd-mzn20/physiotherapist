function UserFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="app-footer" style={{backgroundColor: 'white'}}>
      <p>© {year} PhysioCare. All rights reserved.</p>
      <div className="app-footer__links">
        <span>Developped by : Mohammad Abdallah  </span>
                     </div>
    </footer>
  )
}

export default UserFooter
