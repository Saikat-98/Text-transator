import React, { Component } from 'react';
import { getTranslation } from '../serviceClass';
import { isoCodes } from './isoStandardLanguageCodes'

import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import TranslateIcon from '@material-ui/icons/Translate'
import { Grid } from '@material-ui/core';
import withWidth from '@material-ui/core/withWidth';

const styles = theme => ({
    root: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        boxShadow: 'none',
        width: '100%'
    },
    card: {
        padding: 20,
        width: '80%'
    },
    title: {
        fontSize: 20
    },
    textCursor: {
        cursor: 'auto'
    },
    form: {
        position: 'relative'
    },
    formControl: {
        fontSize: 8
    },
    mediaQueryFontSizeSelect: {
        [theme.breakpoints.up('md')]: {
            fontSize: 15,
        },
        [theme.breakpoints.up('lg')]: {
            fontSize: 20,
        },
    },
    mediaQueryFontSizeWordCount: {
        [theme.breakpoints.down('sm')]: {
            fontSize: 12,
        },
        [theme.breakpoints.up('md')]: {
            fontSize: 12,
        },
        [theme.breakpoints.up('lg')]: {
            fontSize: 15,
        },
    },
    mediaQueryFontSize: {
        [theme.breakpoints.down('sm')]: {
            fontSize: 20,
        },
        [theme.breakpoints.up('md')]: {
            fontSize: 30,
        },
        [theme.breakpoints.up('lg')]: {
            fontSize: 40,
        },
    },
    mediaQueryMarginCardTranslate: {
        [theme.breakpoints.down('sm')]: {
            margin: "auto", 
            marginTop: '-13px',
        },
        [theme.breakpoints.up('md')]: {
            margin: "auto", 
            marginTop: '-13px',
        },
        [theme.breakpoints.up('lg')]: {
            margin: 'auto',
            marginLeft: '0.5%'
        },
    },
    mediaQueryMarginCardSource: {
        [theme.breakpoints.down('sm')]: {
            marginBottom: '-13px',
            margin: "auto"
        },
        [theme.breakpoints.up('md')]: {
            margin: "auto", 
            marginTop: '-13px'
        },
        [theme.breakpoints.up('lg')]: {
            margin: 'auto',
            marginRight: '0.5%'
        },
    },
    mediaQueryBorderCard: {
        [theme.breakpoints.down('sm')]: {
            border: 'none'
        },
        [theme.breakpoints.up('md')]: {
            border: 'none'
        },
        [theme.breakpoints.up('lg')]: {
            border: '1px solid grey'
        },
    }
})

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            showAutoDetect: 'Auto-Detect',
            sourceText: "",
            translatedText: "",
            sourceLength: 0,
            translatedLength: 0,
            sourceLanguage: "auto-detect",
            translatedLanguage: "bn",
            isSwap: window.innerWidth <= 425? false : true,
            isFav: false
        }
    }

    fetchTranslation(value) {
        this.count = 1;
        const input = value;
        const sourceLanguage = this.state.sourceLanguage;
        const translatedLanguage = this.state.translatedLanguage;
        if (this.state.sourceLanguage !== "auto-detect") {
            if (this.hasValue(sourceLanguage)) {
                if (this.hasValue(translatedLanguage)) {
                    if (sourceLanguage !== translatedLanguage) {
                        this.setState({
                            sourceText: input,
                            sourceLength: input.length
                        });

                        if (this.hasValue(input)) {
                            this.setState({
                                isLoaded: false,
                                translatedText: '...'
                            });
                                getTranslation(input, sourceLanguage, translatedLanguage)
                                .then(data => {
                                    this.setState({
                                        isLoaded: true,
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
        else {
            this.setState({
                sourceLanguage: ''
            }, () => {
                if (this.hasValue(input)) {
                    this.setState({
                        isLoaded: false,
                        translatedText: '...'
                    });
                    getTranslation(input, this.state.sourceLanguage, translatedLanguage)
                        .then(data => {
                            this.setState({
                                showAutoDetect: data.responseData.detectedLanguage.concat("(Detected)"),
                                translatedText: data.responseData.translatedText,
                                isLoaded: true,
                                translatedLength: data.responseData.translatedText.length
                            },()=> {console.log(this.state);}
                            );
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
                    showAutoDetect: 'Auto-Detect',
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

        let code=null;
        for(let i=0 ; i<isoCodes.length ; i++){
            if(isoCodes[i].name === (this.state.showAutoDetect.substr(0,this.state.showAutoDetect.length-10)))
                code=isoCodes[i].code;
        }
        // this.sInputRef.value = sourceText;

        if(this.state.sourceLanguage !== 'auto-detect')
            this.setState({
                sourceLanguage: sourceLanguage,
                translatedLanguage: translatedLanguage,
                sourceText: sourceText,
                translatedText: translatedText
            });
        else
            this.setState({
                sourceLanguage: sourceLanguage,
                translatedLanguage: code,
                sourceText: sourceText,
                translatedText: translatedText,
                showAutoDetect: 'Auto-detect'
            });
    }

    handleSourceChange(value) {
        console.log("Source");
        this.setState({
            sourceLanguage: value },() => {
                if(this.count === 1)
                    this.fetchTranslation(this.state.sourceText);
        });
        
    }

    handleTranslatedChange(value) {
        console.log("Transalate");
        this.setState({ translatedLanguage: value },() => {
            if(this.count === 1)
                this.fetchTranslation(this.state.sourceText);
        });
        
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

        let favIconMobile = <Fab aria-label="add" size={this.props.width==='xs'?"small":"large"} style={{
                                backgroundColor: '#444444',
                                color: 'white',
                                position: 'relative',
                                top: '-10px',
                                boxShadow: '0.5px 0.5px 2.5px black'
                            }}>
                                <TranslateIcon onClick={() => this.fetchTranslation(this.state.sourceText)}></TranslateIcon>
                            </Fab>;
        
        let favIconLaptop = <Fab aria-label="add" size={this.props.width==='lg'?"large":"small"} style={{
                                backgroundColor: '#444444',
                                color: 'white',
                                position: 'relative',
                                boxShadow: '0.5px 0.5px 2.5px black'
                            }}>
                                <TranslateIcon onClick={() => this.fetchTranslation(this.state.sourceText)}></TranslateIcon>
                            </Fab>;

        let sourceCard = <Card className={`${classes.card} ${classes.mediaQueryBorderCard} ${classes.mediaQueryMarginCardSource}`} style={{zIndex: '-1', paddingBottom: '0px' }}>
            <CardContent>
                <Paper style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: 'none',
                    boxShadow: 'none'
                }}>
                    <form autoComplete="off" className={classes.form} style={{ display: 'inline-block' }}>
                        <FormControl className={classes.formControl}>
                            <Select
                                displayEmpty
                                autoWidth={true}
                                name="source-languages"
                                value={this.state.sourceLanguage}
                                onChange={event => this.handleSourceChange(event.target.value)}
                                input={<Input id="source-language" />}
                                className={classes.mediaQueryFontSizeSelect}
                            >
                                <MenuItem disabled value="" className={classes.mediaQueryFontSizeSelect}><em>Languages</em></MenuItem>
                                <MenuItem default value="auto-detect" className={classes.mediaQueryFontSizeSelect}>{this.state.showAutoDetect}</MenuItem> 
                                {
                                    isoCodes.map((value, index) => {
                                        return <MenuItem className={classes.mediaQueryFontSizeSelect} value={value.code} key={index + value.toString()}>{value.name}</MenuItem>
                                    }
                                    )
                                }
                            </Select>
                        </FormControl>
                    </form>
                    {
                        this.state.isFav ? favIconLaptop : favIconMobile
                    }
                </Paper>
                <InputBase className={`${classes.title} ${classes.textCursor} ${classes.mediaQueryFontSize}`}
                    placeholder="Enter text here .."
                    multiline
                    rows="4"
                    inputProps={{ 'aria-label': 'naked' }}
                    value={this.state.sourceText}
                    onChange={(event) => {
                        if (event.target.value.length <= 500) {
                            this.setSourceText(event);
                        }
                    }}
                    onKeyPress={(event) => {
                        if(event.key === "Enter")
                            this.fetchTranslation(this.state.sourceText);
                    }}
                    style={{ width: '100%',padding: '0px'}} />
                <Typography className={classes.mediaQueryFontSizeWordCount} variant="h6" style={{
                    display: 'inline-block',
                    float: 'right'
                }}>
                    {this.state.sourceText.length}/500
                    </Typography>
            </CardContent>
        </Card>;

        let translatedCard = <Card className={`${classes.card} ${classes.mediaQueryBorderCard} ${classes.mediaQueryMarginCardTranslate}`} style={{zIndex: '-1', paddingBottom: '0px'}}>
                                <CardContent>
                                    <form autoComplete="off" className={classes.form}>
                                        <FormControl className={classes.formControl}>
                                            <Select
                                                name="translated-languages"
                                                displayEmpty
                                                autoWidth={true}
                                                value={this.state.translatedLanguage}
                                                onChange={event => this.handleTranslatedChange(event.target.value)}
                                                input={<Input id="translated-language" />}
                                                className={classes.mediaQueryFontSizeSelect}
                                            >
                                                <MenuItem disabled value="" className={classes.mediaQueryFontSizeSelect}><em>Languages</em></MenuItem>
                                                {
                                                    isoCodes.map((value, index) => {
                                                        return <MenuItem className={classes.mediaQueryFontSizeSelect} value={value.code} key={index + value.toString()}>{value.name}</MenuItem>
                                                    }
                                                    )
                                                }
                                            </Select>
                                        </FormControl>
                                    </form>
                                    <InputBase className={`${classes.title} ${classes.textCursor} ${classes.mediaQueryFontSize}`}
                                        placeholder="Translated text.."
                                        multiline
                                        readOnly
                                        rows="4"
                                        inputProps={{ 'aria-label': 'naked' }}
                                        value={this.state.translatedText}
                                        style={{ width: '100%', paddingTop: '10px' }} />
                                </CardContent>
                            </Card>;

        let swapButtonMobile = <Paper style={{
                                    border: 'none',
                                    borderRadius: '50%',
                                    position: 'relative',
                                    height: '35px',
                                    width: '35px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    display: 'flex',
                                    boxShadow: '0.5px 0.5px 2.5px black'
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 18 18" width="30px" height="30px" focusable="false" style={{ fill: 'rgba(0, 0, 0, 0.54)' }} onClick={this.swapHandler.bind(this)}>
                                        <path d="M3.73236062,10.8715503 L13.0322567,10.8715503 L13.0322567,12.0771722 L3.73236062,12.0771722 L5.78865676,14.1334683 L4.93615334,14.9859717 L1.44437216,11.4941905 L1.46420147,11.4743612 L1.44437216,11.4545319 L4.93615334,7.96275075 L5.78865676,8.81525416 L3.73236062,10.8715503 Z M12.3264209,3.98599171 L10.1833578,1.84292866 L11.0126403,1.01364616 L13.725446,3.7264518 L13.7271743,3.72472345 L14.5564568,4.55400595 L14.5547285,4.5557343 L14.5564568,4.55746265 L13.7271743,5.38674515 L13.725446,5.3850168 L11.0126403,8.09782244 L10.1833578,7.26853994 L12.2931235,5.15877427 L2.55601282,5.15877427 L2.55601282,3.98599171 L12.3264209,3.98599171 Z" transform="rotate(90 8 8)">
                                        </path>
                                    </svg>
                                </Paper>;

        let swapButtonLaptop = <Paper style={{
                                    border: 'none',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    height: '60px',
                                    width: '60px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    display: 'flex',
                                    cursor: 'pointer',
                                    boxShadow: '0.5px 0.5px 2.5px black'
                                            }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 18 18" width="30px" height="30px" focusable="false" style={{ fill: 'rgba(0, 0, 0, 0.54)' }} onClick={this.swapHandler.bind(this)}>
                                        <path d="M3.73236062,10.8715503 L13.0322567,10.8715503 L13.0322567,12.0771722 L3.73236062,12.0771722 L5.78865676,14.1334683 L4.93615334,14.9859717 L1.44437216,11.4941905 L1.46420147,11.4743612 L1.44437216,11.4545319 L4.93615334,7.96275075 L5.78865676,8.81525416 L3.73236062,10.8715503 Z M12.3264209,3.98599171 L10.1833578,1.84292866 L11.0126403,1.01364616 L13.725446,3.7264518 L13.7271743,3.72472345 L14.5564568,4.55400595 L14.5547285,4.5557343 L14.5564568,4.55746265 L13.7271743,5.38674515 L13.725446,5.3850168 L11.0126403,8.09782244 L10.1833578,7.26853994 L12.2931235,5.15877427 L2.55601282,5.15877427 L2.55601282,3.98599171 L12.3264209,3.98599171 Z">
                                        </path>
                                    </svg>
                                </Paper>;
        
        

        return (
                <Paper style={{ width: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <AppBar style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#444444',
                        width: '100%',
                        padding: '16px 5px'
                    }}>
                        <Typography variant="h4" style={{
                            width: "100%",
                            textAlign: 'center'
                        }}>
                            Translator
                        </Typography>
                    </AppBar>
                    <Grid container justify="center" spacing={0} alignItems="center" className={classes.root}>
                        <Grid item xs={12} lg={6} style={{ height: 'fit-content'}}>
                            {sourceCard}
                        </Grid>
                        {
                            this.props.width === "lg" ? swapButtonLaptop : swapButtonMobile
                        }
                        <Grid item xs={12} lg={6} style={{ height: 'fit-content' }}>
                            {translatedCard}
                        </Grid>
                    </Grid>
                </Paper>            
        )
    }
}

export default withWidth()(withStyles(styles)(Search));