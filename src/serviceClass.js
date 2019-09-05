export const getTranslation = (sourceText,sourceLanguage,translatedLanguage) => {
    console.log("Api called!");
    return fetch(`https://api.mymemory.translated.net/get?de=saikat.choudhury@hyperdart.com&q=${sourceText}&langpair=${sourceLanguage}|${translatedLanguage}`)
        .then(response => response.json())
        .catch(err => {
            console.log(err);
        });
};