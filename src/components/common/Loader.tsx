import '../../index.css'

function Loader() {
  return (
    <div style={styles.container}>
      <div className="loader"></div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default Loader;