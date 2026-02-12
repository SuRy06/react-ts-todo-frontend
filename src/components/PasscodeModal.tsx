import { useRef, useState } from "react";
import "./PasscodeModal.css";

type PasscodeModalProps = {
  isOpen: boolean;
  onSubmit: (passcode: string) => void;
  onCancel: () => void;
};

function PasscodeModal({ isOpen, onSubmit, onCancel }: PasscodeModalProps) {
  const [passcode, setPasscode] = useState("");
  const [isIncorrect, setIsIncorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      return;
    }
    const isValid = passcode === "1234";
    if (!isValid) {
      setIsIncorrect(true);
      setTimeout(() => {
        setIsIncorrect(false);
      }, 2000);
      return;
    }
    onSubmit(passcode);
    setPasscode("");
    setIsIncorrect(false);
  };

  const handleCancel = () => {
    setPasscode("");
    setIsIncorrect(false);
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Enter Passcode</h3>
        <p className="modal-description">
          You need a passcode to mark todos as done.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value);
              setIsIncorrect(false);
            }}
            placeholder="Enter passcode"
            className={`passcode-input ${
              isIncorrect ? "passcode-input-error" : ""
            }`}
            autoFocus
          />
          <div className="modal-buttons">
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasscodeModal;
