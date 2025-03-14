import './Modal.css';
import React from 'react';
import { Link } from 'react-router-dom'

export default function Modal(props) {

  const handleChange = (e) => {
    props.setQuester({verification_text: e.target.value, type: 'verify_text'})
  }

  return (
    <div className="modal fade" id="verificationModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">Modal title</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body text-dark">
            <p>Please enter some verification text below.</p>
            <input onChange={handleChange} className="form-control" type="text" placeholder="Perhaps your name, or something..." />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={props.signProofText}>Continue</button>

          </div>
        </div>
      </div>
    </div>
  )
}
