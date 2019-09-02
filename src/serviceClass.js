export const getTranslation = (sourceText,sourceLanguage,translatedLanguage) => {
    return fetch(`https://api.mymemory.translated.net/get?q=${sourceText}&langpair=${sourceLanguage}|${translatedLanguage}`)
        .then(response => response.json())
        // .then(r => {
        //     let data = {
        //         translatedText: data.matches[0].translation,
        //         translatedLangID: data.matches[0].id
        //     }
        // })
        .catch(err => {
            console.log(err);
        });
};