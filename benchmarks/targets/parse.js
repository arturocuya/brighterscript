module.exports = async (suite, name, brighterscript, projectPath, options) => {
    const { ProgramBuilder, Parser } = brighterscript;

    const builder = new ProgramBuilder();
    //run the first run
    await builder.run({
        cwd: projectPath,
        createPackage: false,
        copyToStaging: false,
        //disable diagnostic reporting (they still get collected)
        diagnosticFilters: ['**/*'],
        logLevel: 'error'
    });
    //collect all the brighterscript files
    const brsFiles = Object.values(builder.program.files).filter(x => x.extension === '.brs' || x.extension === '.bs');
    if (brsFiles.length === 0) {
        throw new Error('No files found in program');
    }

    suite.add(name, () => {
        for (let brsFile of brsFiles) {
            Parser.parse(brsFile.parser.tokens);
        }
    }, options);
};
