function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <p>© {year} PhysioCare. All rights reserved.</p>
      <div className="app-footer__links">
        <span>Developped by : Mohammad Abdallah  </span>
                     </div>
    </footer>
  )
}

export default Footer
