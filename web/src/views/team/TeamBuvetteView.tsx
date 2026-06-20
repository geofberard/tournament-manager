import foodImage from '../../assets/food.png'

export const TeamBuvetteView = () => (
  <img
    src={foodImage}
    alt="Menu de la buvette"
    style={{
      display: 'block',
      height: 'auto',
      margin: '0 auto',
      maxHeight: '70vh',
      maxWidth: '600px',
      objectFit: 'contain',
      width: '100%',
    }}
  />
)
