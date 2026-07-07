import react from 'react';

function MyResumes() {
  return (
    <div className="my_resumes">
      <h2>My Resumes</h2>
      <form>
        <div className="form_card">
          <h3>Upload CV File</h3>
          <div className="form_fields">
            <div className="form_fielset">
              <div className="form_field">
                <label htmlFor="cvFile">CV Attachment<span>*</span></label>
                <input type="file" id="cvFile" name="cvFile" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default MyResumes;