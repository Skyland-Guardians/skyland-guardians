export function AIPanel() {
  return (
    <aside style={{
      width: '18rem',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      position: 'relative'
    }}>
      {/* AI Rabbit - positioned at top right like design */}
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        zIndex: 2
      }}>
        <img 
          src="/assets/主界面1资源/ai人物自动对话.png"
          alt="AI Rabbit"
          style={{
            width: '12rem',
            height: '30rem',
            objectFit: 'contain'
          }}
        />
      </div>


    </aside>
  );
}