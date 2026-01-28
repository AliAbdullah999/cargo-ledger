import InputRecord from "./components/InputRecord"
function App() {
  const toggleTheme = () => {
    const html = document.documentElement;
    html.dataset.bsTheme =
      html.dataset.bsTheme === 'dark' ? 'light' : 'dark';
  };

  return (
    <>
      <div className="d-flex justify-content-end p-2">
        <button
          onClick={toggleTheme}
          className="btn btn-outline-secondary btn-sm"
        >
          Toggle theme
        </button>
      </div>

      <InputRecord />
    </>
  );
}

export default App;

