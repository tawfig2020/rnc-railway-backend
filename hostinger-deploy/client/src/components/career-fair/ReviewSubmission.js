import React from 'react';
import { 
  Grid, Typography, Box, Paper, Divider, List, ListItem, 
  ListItemText, Chip, Rating, Accordion, AccordionSummary,
  AccordionDetails, Button, Avatar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  ExpandMore, Check, Description, Person, School, Work, 
  Psychology, Lightbulb, Event, StarBorder
} from '@mui/icons-material';

const ReviewSubmission = ({ formData }) => {
  const theme = useTheme();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
        Review Your Information
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
        Please review your information carefully before submitting. You can go back to previous sections to make changes if needed.
      </Typography>

      {/* Personal Information Section */}
      <Accordion defaultExpanded elevation={2} sx={{ mb: 3, borderRadius: '4px', overflow: 'hidden' }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            '& .MuiAccordionSummary-expandIconWrapper': {
              color: 'white'
            }
          }}
        >
          <Person sx={{ mr: 2 }} />
          <Typography variant="h6">Personal Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={formData.profilePhoto ? URL.createObjectURL(formData.profilePhoto) : ''}
                sx={{
                  width: 100,
                  height: 100,
                  mb: 1,
                  bgcolor: theme.palette.primary.light,
                  border: '3px solid white',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              >
                {!formData.profilePhoto && <Person sx={{ fontSize: 50 }} />}
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {formData.firstName} {formData.lastName}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={8}>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Email Address" 
                    secondary={formData.email || 'Not provided'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Phone Number" 
                    secondary={formData.phone || 'Not provided'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Date of Birth" 
                    secondary={formData.dateOfBirth ? formatDate(formData.dateOfBirth) : 'Not provided'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Gender" 
                    secondary={formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : 'Not provided'} 
                  />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                Address
              </Typography>
              <Typography variant="body2">
                {formData.address ? (
                  <>
                    {formData.address}<br />
                    {formData.city && `${formData.city}, `}
                    {formData.postalCode && `${formData.postalCode}, `}
                    {formData.country}
                  </>
                ) : (
                  'Address not provided'
                )}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                Languages Spoken
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.languages && formData.languages.length > 0 ? (
                  formData.languages.map((language, index) => (
                    <Chip key={index} label={language} size="small" />
                  ))
                ) : (
                  <Typography variant="body2">No languages selected</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Education & Certifications Section */}
      <Accordion defaultExpanded elevation={2} sx={{ mb: 3, borderRadius: '4px', overflow: 'hidden' }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ 
            bgcolor: theme.palette.primary.dark, 
            color: 'white',
            '& .MuiAccordionSummary-expandIconWrapper': {
              color: 'white'
            }
          }}
        >
          <School sx={{ mr: 2 }} />
          <Typography variant="h6">Education & Certifications</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
            Education History
          </Typography>
          
          {formData.educationHistory.map((edu, index) => (
            <Paper 
              key={index} 
              elevation={1} 
              sx={{ 
                p: 2, 
                mb: 2,
                borderLeft: `4px solid ${theme.palette.primary.main}`
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {edu.institution || 'Institution not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {edu.degree || 'Degree not specified'}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {edu.startDate ? formatDate(edu.startDate) : 'Start date not specified'} - {' '}
                {edu.current ? 'Present' : (edu.endDate ? formatDate(edu.endDate) : 'End date not specified')}
              </Typography>
              {edu.description && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {edu.description}
                </Typography>
              )}
            </Paper>
          ))}
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
            Certifications & Qualifications
          </Typography>
          
          {formData.certifications.map((cert, index) => (
            <Paper 
              key={index} 
              elevation={1} 
              sx={{ 
                p: 2, 
                mb: 2,
                borderLeft: `4px solid ${theme.palette.secondary.main}`
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {cert.name || 'Certification not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Issued by: {cert.issuingOrganization || 'Organization not specified'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Issued: {cert.issueDate ? formatDate(cert.issueDate) : 'Issue date not specified'}
                {!cert.noExpiration && cert.expirationDate && (
                  <> - Expires: {formatDate(cert.expirationDate)}</>
                )}
                {cert.noExpiration && (
                  <> - No expiration</>
                )}
              </Typography>
              {cert.credentialID && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Credential ID: {cert.credentialID}
                </Typography>
              )}
            </Paper>
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Work Experience Section */}
      <Accordion defaultExpanded elevation={2} sx={{ mb: 3, borderRadius: '4px', overflow: 'hidden' }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ 
            bgcolor: theme.palette.secondary.main, 
            color: 'white',
            '& .MuiAccordionSummary-expandIconWrapper': {
              color: 'white'
            }
          }}
        >
          <Work sx={{ mr: 2 }} />
          <Typography variant="h6">Work Experience</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
            Formal Work Experience
          </Typography>
          
          {formData.workExperience.map((job, index) => (
            <Paper 
              key={index} 
              elevation={1} 
              sx={{ 
                p: 2, 
                mb: 2,
                borderLeft: `4px solid ${theme.palette.secondary.main}`
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {job.title || 'Position not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {job.company || 'Company not specified'}{job.location ? ` | ${job.location}` : ''}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {job.startDate ? formatDate(job.startDate) : 'Start date not specified'} - {' '}
                {job.current ? 'Present' : (job.endDate ? formatDate(job.endDate) : 'End date not specified')}
              </Typography>
              {job.description && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Description:</strong> {job.description}
                </Typography>
              )}
              {job.responsibilities && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Responsibilities:</strong> {job.responsibilities}
                </Typography>
              )}
              {job.achievements && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Achievements:</strong> {job.achievements}
                </Typography>
              )}
            </Paper>
          ))}
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
            Volunteer Experience
          </Typography>
          
          {formData.volunteerExperience.map((vol, index) => (
            <Paper 
              key={index} 
              elevation={1} 
              sx={{ 
                p: 2, 
                mb: 2,
                borderLeft: `4px solid ${theme.palette.success.main}`
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {vol.role || 'Role not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {vol.organization || 'Organization not specified'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {vol.startDate ? formatDate(vol.startDate) : 'Start date not specified'} - {' '}
                {vol.current ? 'Present' : (vol.endDate ? formatDate(vol.endDate) : 'End date not specified')}
              </Typography>
              {vol.description && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {vol.description}
                </Typography>
              )}
            </Paper>
          ))}
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
            Informal Experience
          </Typography>
          
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              mb: 2
            }}
          >
            <Typography variant="body2">
              {formData.informalExperience || 'No informal experience provided'}
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* Skills Assessment Section */}
      <Accordion defaultExpanded elevation={2} sx={{ mb: 3, borderRadius: '4px', overflow: 'hidden' }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ 
            bgcolor: theme.palette.secondary.dark, 
            color: 'white',
            '& .MuiAccordionSummary-expandIconWrapper': {
              color: 'white'
            }
          }}
        >
          <Psychology sx={{ mr: 2 }} />
          <Typography variant="h6">Skills Assessment</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
            Soft Skills
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {Object.entries(formData.softSkills).map(([skill, rating]) => (
              <Grid item xs={12} sm={6} md={4} key={skill}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'background.paper'
                }}>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 500, 
                    textTransform: 'capitalize',
                    mb: 0.5
                  }}>
                    {skill.replace(/([A-Z])/g, ' $1')}
                  </Typography>
                  <Rating
                    value={rating}
                    readOnly
                    max={5}
                    emptyIcon={<StarBorder fontSize="inherit" />}
                    size="small"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
            Technical & Practical Skills
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {formData.technicalSkills.map((skill, index) => (
              <Chip 
                key={index} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" component="span">
                      {skill.skill}
                    </Typography>
                    <Typography variant="caption" component="span" sx={{ ml: 1, opacity: 0.7 }}>
                      (Level: {skill.level}/5)
                    </Typography>
                  </Box>
                }
                sx={{ borderRadius: '4px' }}
              />
            ))}
            
            {formData.customSkills.map((skill, index) => (
              <Chip 
                key={`custom-${index}`} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" component="span">
                      {skill.skill}
                    </Typography>
                    <Typography variant="caption" component="span" sx={{ ml: 1, opacity: 0.7 }}>
                      ({skill.category}, Level: {skill.level}/5)
                    </Typography>
                  </Box>
                }
                sx={{ borderRadius: '4px' }}
              />
            ))}
            
            {formData.technicalSkills.length === 0 && formData.customSkills.length === 0 && (
              <Typography variant="body2">No technical skills provided</Typography>
            )}
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
            Language Proficiency
          </Typography>
          
          {formData.languageProficiency.map((lang, index) => (
            lang.language ? (
              <Paper 
                key={index} 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  mb: 2
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  {lang.language}
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={3}>
                    <Typography variant="caption" display="block">Speaking</Typography>
                    <Rating value={lang.speaking} readOnly max={5} size="small" />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="caption" display="block">Writing</Typography>
                    <Rating value={lang.writing} readOnly max={5} size="small" />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="caption" display="block">Reading</Typography>
                    <Rating value={lang.reading} readOnly max={5} size="small" />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="caption" display="block">Listening</Typography>
                    <Rating value={lang.listening} readOnly max={5} size="small" />
                  </Grid>
                </Grid>
              </Paper>
            ) : null
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Career Goals Section */}
      <Accordion defaultExpanded elevation={2} sx={{ mb: 3, borderRadius: '4px', overflow: 'hidden' }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ 
            bgcolor: theme.palette.success.main, 
            color: 'white',
            '& .MuiAccordionSummary-expandIconWrapper': {
              color: 'white'
            }
          }}
        >
          <Lightbulb sx={{ mr: 2 }} />
          <Typography variant="h6">Career Goals & Preferences</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Desired Role</Typography>
              <Typography variant="body2">
                {formData.desiredRole || 'Not specified'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Desired Industries</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {formData.desiredIndustry && formData.desiredIndustry.length > 0 ? (
                  formData.desiredIndustry.map((industry, index) => (
                    <Chip key={index} label={industry} size="small" />
                  ))
                ) : (
                  <Typography variant="body2">Not specified</Typography>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Career Objective</Typography>
              <Typography variant="body2">
                {formData.careerObjective || 'Not provided'}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Salary Expectations</Typography>
              <Typography variant="body2">
                {formData.salaryExpectations || 'Not provided'}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Work Preferences</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {formData.workPreferences.fullTime && <Chip label="Full-time" size="small" />}
                {formData.workPreferences.partTime && <Chip label="Part-time" size="small" />}
                {formData.workPreferences.contract && <Chip label="Contract" size="small" />}
                {formData.workPreferences.internship && <Chip label="Internship" size="small" />}
                {formData.workPreferences.remoteWork && <Chip label="Remote Work" size="small" />}
                {formData.workPreferences.relocation && <Chip label="Willing to Relocate" size="small" />}
                
                {!Object.values(formData.workPreferences).some(Boolean) && (
                  <Typography variant="body2">No preferences selected</Typography>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>Documents</Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Resume/CV" 
                    secondary={formData.resume ? formData.resume.name : 'Not uploaded'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Cover Letter" 
                    secondary={formData.coverLetter ? formData.coverLetter.name : 'Not uploaded'} 
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>Professional Links</Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Portfolio/Website" 
                    secondary={formData.portfolio || 'Not provided'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="LinkedIn Profile" 
                    secondary={formData.linkedin || 'Not provided'} 
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Availability Section */}
      <Accordion defaultExpanded elevation={2} sx={{ mb: 3, borderRadius: '4px', overflow: 'hidden' }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ 
            bgcolor: theme.palette.success.dark, 
            color: 'white',
            '& .MuiAccordionSummary-expandIconWrapper': {
              color: 'white'
            }
          }}
        >
          <Event sx={{ mr: 2 }} />
          <Typography variant="h6">Availability & Preferences</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Available Dates</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {formData.availableDates && formData.availableDates.length > 0 ? (
                  formData.availableDates.map((date, index) => (
                    <Typography key={index} variant="body2">
                      {formatDate(date)}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2">No dates selected</Typography>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Preferred Time Slots</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {formData.preferredTimeSlots && formData.preferredTimeSlots.length > 0 ? (
                  formData.preferredTimeSlots.map((timeSlot, index) => (
                    <Chip key={index} label={timeSlot} size="small" />
                  ))
                ) : (
                  <Typography variant="body2">No time slots selected</Typography>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Interview Preference</Typography>
              <Typography variant="body2">
                {formData.interviewPreference || 'Not specified'}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>Special Accommodations</Typography>
              <Typography variant="body2">
                {formData.specialAssistance || 'None specified'}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Dietary Restrictions</Typography>
              <Typography variant="body2">
                {formData.dietaryRestrictions || 'None specified'}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>Emergency Contact</Typography>
              <Typography variant="body2">
                {formData.emergencyContact.name ? (
                  <>
                    {formData.emergencyContact.name} ({formData.emergencyContact.relationship})<br />
                    Phone: {formData.emergencyContact.phone}
                  </>
                ) : (
                  'Not provided'
                )}
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ p: 3, bgcolor: 'rgba(42, 125, 111, 0.08)', borderRadius: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Check sx={{ color: theme.palette.success.main, mr: 2, mt: 0.5 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
              Consent & Data Usage
            </Typography>
            <Typography variant="body2">
              By submitting this form, you consent to the Refugee Network Centre storing and processing your personal information for the purpose of the Career Fair registration and job matching. Your information will only be shared with potential employers with your consent.
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Description sx={{ color: theme.palette.primary.main, mr: 2, mt: 0.5 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              Next Steps
            </Typography>
            <Typography variant="body2">
              After submitting your registration, you will receive a confirmation email with further details about the Career Fair. Our team will review your information and may contact you if additional information is needed.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ReviewSubmission;
