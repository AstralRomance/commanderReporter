import React, { Fragment, useState, useMemo, Component } from 'react';
import { JsonForms } from '@jsonforms/react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import logo from './logo.svg';
import './App.css';
import schema from './schema.json';
import uischema from './uischema.json';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  container: {
    padding: '1em',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    padding: '0.25em',
  },
  dataContent: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '0.25em',
    backgroundColor: '#cecece',
    marginBottom: '1rem',
  },
  resetButton: {
    margin: 'auto !important',
    display: 'block !important',
  },
  demoform: {
    margin: 'auto',
    padding: '1rem',
  },
});

let initialData = {

};

const myRequest = new Request("http://localhost:8000/event-manager/get-full-event-data/8477f080-8066-448d-9101-84579f3faf23");

fetch(myRequest)
  .then(response => response.json())
  .then(data => {
    initialData = data;
  });


const renderers = [
  ...materialRenderers
];


export default class Json extends Component{
    constructor(props){
        super(props)
        this.classes = useStyles();
        [this.data, this.setData] = useState<any>(initialData);
        this.stringifiedData = useMemo(() => JSON.stringify(data, null, 2), [data]);
    };



    clearData () {
       this.setData({});
    };

    render () {
        return (
        <Fragment>
          <div className='App'>
            <header className='App-header'>
              <img src={logo} className='App-logo' alt='logo' />
              <h1 className='App-title'>Welcome to JSON Forms with React</h1>
              <p className='App-intro'>More Forms. Less Code.</p>
            </header>
          </div>

          <Grid
            container
            justifyContent={'center'}
            spacing={1}
            className={this.classes.container}
          >
            <Grid item sm={6}>
              <Typography variant={'h4'} className={this.classes.title}>
                Bound data
              </Typography>
              <div className={this.classes.dataContent}>
                <pre id='boundData'>{this.stringifiedData}</pre>
              </div>
              <Button
                className={this.classes.resetButton}
                onClick={this.clearData}
                color='primary'
                variant='contained'
              >
                Clear data
              </Button>
            </Grid>
            <Grid item sm={6}>
              <Typography variant={'h4'} className={this.classes.title}>
                Rendered form
              </Typography>
              <div className={this.classes.demoform}>
                <JsonForms
                  schema={schema}
                  uischema={uischema}
                  data={data}
                  renderers={renderers}
                  cells={materialCells}
                  onChange={({ errors, data }) => this.setData(data)}
                />
              </div>
            </Grid>
          </Grid>
        </Fragment>
      );
    }
}