import React, { Component } from 'react';
import { getTranslation } from '../serviceClass';
import { isoCodes } from './isoStandardLanguageCodes'

import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';


const styles = {
    root: {
        minHeight: '100%',
        boxShadow: 'none',
        height: window.innerHeight,
        position: 'absolute',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    card: {
        padding: 20,
        width: '80%',
        height: '20%'
    },
    title: {
        fontSize: 20
    },
    textCursor: {
        cursor: 'auto'
    },
    form: {
        position: 'relative',
        top: '-15px'
    },
    formControl: {
        fontSize: 8,
    }
}

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sourceText: "",
            translatedText: "",
            sourceLength: 0,
            translatedLength: 0,
            sourceLanguage: "",
            translatedLanguage: ""
        }
    }

    fetchTranslation(value) {
        const input = value;
        const sourceLanguage = this.state.sourceLanguage;
        const translatedLanguage = this.state.translatedLanguage;
        if(this.state.sourceLanguage !== "auto-detect"){
            if (this.hasValue(sourceLanguage)) {
                if (this.hasValue(translatedLanguage)) {
                    if (sourceLanguage !== translatedLanguage) {
                        this.setState({
                            sourceText: input,
                            sourceLength: input.length
                        });

                        if (this.hasValue(input)) {
                            getTranslation(input, sourceLanguage, translatedLanguage)
                                .then(data => {
                                    this.setState({
                                        translatedText: data.matches[0].translation,
                                        translatedLength: data.matches[0].translation.length
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        } else {
                            this.setState({
                                translatedText: '',
                                translatedLength: 0
                            });
                        }
                    }
                    else {
                        console.log("Please select two distinct languages!");
                    }
                }
                else {
                    console.log("Translated language can't be null!");
                }
            }
            else {
                console.log("Source language can't be null!");
            }
        }   
        else{
            this.setState({
                sourceLanguage: ''
            },() => {
                if (this.hasValue(input)) {
                    getTranslation(input, this.state.sourceLanguage, translatedLanguage)
                        .then(data => {
                            this.setState({
                                translatedText: data.matches[0].translation,
                                translatedLength: data.matches[0].translation.length
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    this.setState({
                        translatedText: '',
                        translatedLength: 0
                    });
                }
                this.setState({
                    sourceLanguage: 'auto-detect'
                });
            });
        }
    }

    swapHandler() {
        let sourceLanguage = this.state.sourceLanguage;
        let translatedLanguage = this.state.translatedLanguage;
        let sourceText = this.state.sourceText;
        let translatedText = this.state.translatedText;
        
        let temp1 = sourceText;
        sourceText = translatedText;
        translatedText = temp1;
        
        let temp = sourceLanguage;
        sourceLanguage = translatedLanguage;
        translatedLanguage = temp;

        // this.sInputRef.value = sourceText;
        
        this.setState({
            sourceLanguage: sourceLanguage,
            translatedLanguage: translatedLanguage,
            sourceText: sourceText,
            translatedText: translatedText
        });
    }

    handleSourceChange(value) {
        this.setState({ sourceLanguage: value 
        });
        
    }

    handleTranslatedChange(value) {
        this.setState({ translatedLanguage: value });
    }

    setSourceText(event) {
        this.setState({
            sourceText: event.target.value,
            sourceLength: event.target.value.length
        });
    }

    hasValue = (item) => {
        return ((item !== null) && (item !== '') && (item !== undefined));
    };

    // autoDetectHandler(){
    //     this.setState({
    //         sourceLanguage: ' '
    //     });
    // }
    // componentDidUpdate(prevProps, prevState) {
    //     console.log(this.props);
    //     // console.log(prevProps.match.params.query,this.props.match.params.query);
    //     if( prevProps.match.params.query !== this.props.match.params.query ) {
    //       this.fetchTranslation();
    //     }
    //   }

    render() {
        const { classes } = this.props;

        let sourceCard = <Card className={classes.card} style={{ marginBottom: '2px'}}>
            <CardContent>
                <Paper style={{display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'space-between',
                               border: 'none',
                               boxShadow: 'none'
                               }}>
                    <form autoComplete="off" className={classes.form} style={{display: 'inline-block'}}>
                        <FormControl className={classes.formControl} style={{ width: '10.5em' }}>
                            <Select
                                displayEmpty
                                name="source-languages"
                                value={this.state.sourceLanguage}
                                onChange={event => this.handleSourceChange(event.target.value)}
                                input={<Input id="source-language" />}
                            >
                                <MenuItem disabled value=""><em>Languages</em></MenuItem>
                                <MenuItem value="auto-detect">Auto-Detect</MenuItem>
                                {
                                    isoCodes.map((value, index) => {
                                        return <MenuItem value={value.code} key={index + value.toString()}>{value.name}</MenuItem>
                                    }
                                    )
                                }
                            </Select>
                        </FormControl>
                    </form>
                    <Button variant="contained" onClick={() => this.fetchTranslation(this.state.sourceText)} style={{position: 'relative',
                                                        top: '-15px',
                                                        backgroundColor: '#444444',
                                                        color: 'white'
                    }}>
                        Translate
                    </Button>
                </Paper>
                <InputBase className={`${classes.title} ${classes.textCursor}`}
                    placeholder="Enter text here .."
                    multiline
                    rows="3"
                    inputProps={{ 'aria-label': 'naked' }}
                    value={this.state.sourceText}
                    onChange={(event) => {
                            if(event.target.value.length<=500){
                                this.setSourceText(event);
                            }}}
                    style={{width: '100%'}}/>
                    <Typography variant="h6" style={{position: 'relative',
                                                    fontSize: '12px',
                                                    textAlign: 'right'
                    }}>
                        {this.state.sourceText.length}/500
                    </Typography>
            </CardContent>
            <CardActions>
                
            </CardActions>
        </Card>;

        let translatedCard = <Card className={classes.card} style={{ marginTop: '2px' }}>
            <CardContent>
                <form autoComplete="off" className={classes.form}>
                    <FormControl className={classes.formControl} style={{ width: '10.5em' }}>
                        <Select
                            name="translated-languages"
                            displayEmpty
                            value={this.state.translatedLanguage}
                            onChange={event => this.handleTranslatedChange(event.target.value)}
                            input={<Input id="translated-language" />}>
                                <MenuItem disabled value=""><em>Languages</em></MenuItem>
                            {
                                isoCodes.map((value, index) => {
                                    return <MenuItem value={value.code} key={index + value.toString()}>{value.name}</MenuItem>
                                }
                                )
                            }
                        </Select>
                    </FormControl>
                </form>
                <InputBase className={`${classes.title} ${classes.textCursor}`}
                        placeholder="Translated text.."
                        multiline
                        readOnly
                        rows="3"
                        inputProps={{ 'aria-label': 'naked' }}
                        value={this.state.translatedText} 
                        style={{width: '100%'}}/>
            </CardContent>
        </Card>;

        return (
            <Grid container style={{ width: '100%' }}>
                <AppBar position="static" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#444444',
                    width: '100%',
                    padding: '10px 5px'
                }}>
                    <Typography variant="h4" style={{
                        width: "100%",
                        textAlign: 'center'
                    }}>
                        Translator  
                    </Typography>
                </AppBar>
                <Paper className={classes.root}>
                    {sourceCard}
                    <Paper style={{
                        border: 'none',
                        borderRadius: '15px',
                        position: 'absolute',
                        height: '5.9%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 18 18" width="30px" height="30px" focusable="false" style={{ fill: 'rgba(0, 0, 0, 0.54)' }} onClick={this.swapHandler.bind(this)}>
                            <path d="M3.73236062,10.8715503 L13.0322567,10.8715503 L13.0322567,12.0771722 L3.73236062,12.0771722 L5.78865676,14.1334683 L4.93615334,14.9859717 L1.44437216,11.4941905 L1.46420147,11.4743612 L1.44437216,11.4545319 L4.93615334,7.96275075 L5.78865676,8.81525416 L3.73236062,10.8715503 Z M12.3264209,3.98599171 L10.1833578,1.84292866 L11.0126403,1.01364616 L13.725446,3.7264518 L13.7271743,3.72472345 L14.5564568,4.55400595 L14.5547285,4.5557343 L14.5564568,4.55746265 L13.7271743,5.38674515 L13.725446,5.3850168 L11.0126403,8.09782244 L10.1833578,7.26853994 L12.2931235,5.15877427 L2.55601282,5.15877427 L2.55601282,3.98599171 L12.3264209,3.98599171 Z" transform="rotate(90 8 8)">
                            </path>
                        </svg>
                    </Paper>
                    {translatedCard}
                </Paper>
            </Grid>
        )
    }
}

export default withStyles(styles)(Search);