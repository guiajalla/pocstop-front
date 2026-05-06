export const FeedbackToast = ({ feedback }) => {
  if (!feedback) return null
  return (
    <div style={{
      position: 'fixed', top: 80, right: 24, zIndex: 999,
      background: feedback.tipo === 'erro' ? '#fee2e2' : '#e8f5e8',
      color: feedback.tipo === 'erro' ? '#b91c1c' : '#2d7a2d',
      border: `1px solid ${feedback.tipo === 'erro' ? '#fca5a5' : '#86efac'}`,
      borderRadius: 8, padding: '12px 20px', fontSize: 13, fontWeight: 500,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      {feedback.msg}
    </div>
  )
}
