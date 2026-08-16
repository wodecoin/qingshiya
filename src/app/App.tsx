import '../styles/tokens.css'

export function App() {
  return (
    <div className="app-shell">
      <main className="app-content">
        <p className="eyebrow">给心里留一点空间</p>
        <h1>轻释压</h1>
        <section className="welcome-card" aria-labelledby="welcome-title">
          <div className="welcome-orb" aria-hidden="true">☁</div>
          <div>
            <h2 id="welcome-title">今天感觉怎么样？</h2>
            <p>不用急着解决所有事情，先把此刻的感受放下来。</p>
          </div>
          <button type="button" className="primary-action">记录一次压力</button>
        </section>
        <section className="empty-state" aria-labelledby="empty-title">
          <p className="empty-kicker">你的空间</p>
          <h2 id="empty-title">还没有记录</h2>
          <p>从一次轻轻的记录开始，听见自己的需要。</p>
        </section>
      </main>
      <nav className="bottom-nav" aria-label="主要导航">
        <a href="#home" aria-current="page">首页</a>
        <a href="#insights">回顾</a>
        <a href="#settings">设置</a>
      </nav>
    </div>
  )
}
