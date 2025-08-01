export async function uploadToCloudinary(file: File, companyName?: string): Promise<string> {
    const cloudName = "dmi9k62p1";
    const uploadPreset = "jobtracker_unsigned";
  
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    
    // Create a clean company name for the folder structure
    const cleanCompanyName = companyName 
      ? companyName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
      : 'unknown_company';
    
    formData.append("public_id", `resumes/${cleanCompanyName}/${Date.now()}_${file.name.replace(/\.(pdf|txt)$/, '')}`);
  
    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
  
      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
      }
  
      const data = await res.json();
      if (!data.secure_url || !data.url) {
        throw new Error("Upload failed: No secure URL returned");
      }
      
      return data.secure_url || data.url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to upload to Cloudinary: ${errorMessage}`);
    }
  }
  