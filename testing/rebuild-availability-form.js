const fs = require('fs');
const path = require('path');

// Target file
const targetFile = path.resolve('client/src/components/career-fair/AvailabilityForm.js');

// Read the entire file
console.log(`Creating complete rebuild of ${targetFile}...`);
const content = fs.readFileSync(targetFile, 'utf8');

// Make a backup of the original file
fs.writeFileSync(`${targetFile}.original`, content, 'utf8');
console.log(`Original file backed up to ${targetFile}.original`);

// Extract the imports and constants from the top of the file
const importEndIndex = content.indexOf('const AvailabilityForm =');
const imports = content.substring(0, importEndIndex);

// Extract the component function signature
const functionSignatureMatch = content.match(/const AvailabilityForm = \([^)]*\) => {/);
const functionSignature = functionSignatureMatch ? functionSignatureMatch[0] : 'const AvailabilityForm = ({ formData, handleChange }) => {';

// Extract the export at the end
const exportLine = 'export default AvailabilityForm;';

// Create a simplified but well-structured body
const newComponentBody = `
  // Get theme for consistent styling
  const theme = useTheme();

  // Handle emergency contact field changes
  const handleEmergencyContactChange = (field, value) => {
    handleChange('emergencyContact', field, value);
  };

  return (
    <ErrorBoundary fallbackMessage="There was an error loading the availability form. Please try again later.">
      <Box className="availability-form" data-testid="availability-form">
        <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
          Availability & Preferences
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Please indicate your availability for the Career Fair and any specific needs or preferences you may have.
        </Typography>

        {/* Date Availability Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Event sx={{ color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Date Availability
            </Typography>
          </Box>

          <Paper elevation={2} sx={{ p: 3, borderRadius: '4px' }}>
            <Typography variant="subtitle1" gutterBottom>
              Select the dates you are available to attend the Career Fair:
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              The fair will run from July 15-17, 2025. You can attend on multiple days.
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              {['July 15', 'July 16', 'July 17'].map((date) => (
                <Grid item xs={12} sm={4} key={date}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.availableDates?.includes(date) || false}
                        onChange={(e) => {
                          const currentDates = formData.availableDates || [];
                          if (e.target.checked) {
                            handleChange('availableDates', [...currentDates, date]);
                          } else {
                            handleChange('availableDates', 
                              currentDates.filter((d) => d !== date)
                            );
                          }
                        }}
                        color="primary"
                      />
                    }
                    label={date}
                  />
                </Grid>
              ))}
            </Grid>

            {formData.availableDates?.length === 0 && (
              <Typography color="error" sx={{ mt: 1 }}>
                Please select at least one date you are available.
              </Typography>
            )}
          </Paper>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Time Preference Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccessTime sx={{ color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Time Preferences
            </Typography>
          </Box>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              What time of day do you prefer to participate?
            </Typography>

            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <RadioGroup
                value={formData.timePreference || ''}
                onChange={(e) => handleChange('timePreference', e.target.value)}
              >
                <FormControlLabel value="morning" control={<Radio />} label="Morning (9:00 AM - 12:00 PM)" />
                <FormControlLabel value="afternoon" control={<Radio />} label="Afternoon (1:00 PM - 4:00 PM)" />
                <FormControlLabel value="flexible" control={<Radio />} label="Flexible (No preference)" />
              </RadioGroup>
            </FormControl>
          </Paper>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Emergency Contact Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ContactPhone sx={{ color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Emergency Contact
            </Typography>
          </Box>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Please provide an emergency contact
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Name"
                  variant="outlined"
                  value={formData.emergencyContact?.name || ''}
                  onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  variant="outlined"
                  value={formData.emergencyContact?.phone || ''}
                  onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Relationship"
                  variant="outlined"
                  value={formData.emergencyContact?.relationship || ''}
                  onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Box>

        <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(211, 97, 53, 0.1)', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Note:</strong> We&apos;ll do our best to accommodate your availability preferences, but please understand that employer schedules may vary. We&apos;ll confirm your schedule before the event.
          </Typography>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};
`;

// Combine all parts
const newContent = imports + functionSignature + newComponentBody + '\n\n' + exportLine + '\n';

// Write the new content
fs.writeFileSync(targetFile, newContent, 'utf8');
console.log(`Successfully rebuilt ${targetFile} with proper JSX structure`);
console.log('The file should now compile without errors.');
