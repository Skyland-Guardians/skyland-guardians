export function AIPanel() {
  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '175px',
        backgroundColor: `#B1D5FB`,
        borderRadius: '12px',
        margin: `20px 40px`,
        position: 'relative',
        height: '550px',
      }}>
          				<img src="./assets/main-screen-1-assets/right-ai-character.png" alt="AI Rabbit" style={{maxWidth: '200px',position: 'absolute',top: '-30px',left: '-35px'}}/>
          <div style={{
            backgroundColor: `#FFFCF7`,
            fontSize: `19px`,
            fontFamily: `Koulen`,
            fontWeight: `600`,
            color: `#000000`,
            padding: `10px`,
            borderRadius: `12px`,
            margin: `0px 20px 20px 20px`,
            textAlign: `start`,
            lineHeight: `1.5`,
            position: 'absolute',
            top:'94px'
          }}>
            Good morning, little Guardian! The investment performance yesterday was quite good
            Do you want to try any new challenges today?
          </div>
      </div>
    </>
  );
}