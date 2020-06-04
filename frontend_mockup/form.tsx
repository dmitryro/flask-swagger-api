import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MaterialUIForm from 'react-material-ui-form'
 

class Form extends React.Component {
  handleValuesChange = (values, pristineValues) => {
    // get all values and pristineValues when any field updates
  }

  handleFieldValidations = (field) => {
    // get field object when its validation status updates
  }

  submit = (values, pristineValues) => {
    // get all values and pristineValues on form submission
  }

  render() {
    return (
      <MaterialUIForm onSubmit={this.submit}
onValuesChange={this.handleValuesChange}
onFieldValidation={this.handleFieldValidations}>
        <TextField label="Name" name="name" value="doge" required />

        <Button variant="raised" type="submit">Submit</Button>
      </MaterialUIForm>
    )
  }
}
