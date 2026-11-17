import './loader.css';

interface LoaderProps {
  isLoading?: boolean;
  message?: string;
}

export function Loader({ isLoading = false }: LoaderProps) {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="loader-wrapper">
      <div className="sk-folding-cube">
        <div className="sk-cube1 sk-cube"></div>
        <div className="sk-cube2 sk-cube"></div>
        <div className="sk-cube4 sk-cube"></div>
        <div className="sk-cube3 sk-cube"></div>
      </div>
    </div>
  );
}
