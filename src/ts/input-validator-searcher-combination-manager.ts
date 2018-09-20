import { CalculatorSearcher } from "./searcher/calculator-searcher";
import { CalculatorInputValidator } from "./input-validators/calculator-input-validator";
import { FilePathSearcher } from "./searcher/file-path-searcher";
import { FilePathInputValidator } from "./input-validators/file-path-input-validator";
import { CommandLineSearcher } from "./searcher/command-line-searcher";
import { CommandLineInputValidator } from "./input-validators/command-line-input-validator";
import { WebSearchSearcher } from "./searcher/web-search-searcher";
import { WebSearchInputValidator } from "./input-validators/web-search-input-validator";
import { EmailAddressSearcher } from "./searcher/email-address-searcher";
import { EmailAddressInputValidator } from "./input-validators/email-address-input-validator";
import { WebUrlSearcher } from "./searcher/web-url-searcher";
import { WebUrlInputValidator } from "./input-validators/web-url-input-validator";
import { SearchPluginsSearcher } from "./searcher/search-plugins-searcher";
import { SearchPluginsInputValidator } from "./input-validators/search-plugins-input-validator";
import { InputValidatorSearcherCombination } from "./input-validator-searcher-combination";
import { UeliHelpers } from "./helpers/ueli-helpers";
import { ConfigOptions } from "./config-options";
import { CountManager } from "./count-manager";
import { CountFileRepository } from "./count-file-repository";
import { Injector } from "./injector";
import { platform } from "os";
import { CustomCommandSearcher } from "./searcher/custom-command-searcher";
import { CustomCommandInputValidator } from "./input-validators/custom-command-input-validator";

export class InputValidatorSearcherCombinationManager {
    private combinations: InputValidatorSearcherCombination[];

    constructor(config: ConfigOptions) {
        const iconSet = Injector.getIconSet(platform());
        const countManager = new CountManager(new CountFileRepository(UeliHelpers.countFilePath));
        const environmentVariableCollection = process.env as { [key: string]: string };

        this.combinations = [
            {
                searcher: new CalculatorSearcher(),
                validator: new CalculatorInputValidator(),
            },
            {
                searcher: new FilePathSearcher(config),
                validator: new FilePathInputValidator(),
            },
            {
                searcher: new CommandLineSearcher(),
                validator: new CommandLineInputValidator(),
            },
            {
                searcher: new WebSearchSearcher(config.webSearches),
                validator: new WebSearchInputValidator(config.webSearches),
            },
            {
                searcher: new EmailAddressSearcher(),
                validator: new EmailAddressInputValidator(),
            },
            {
                searcher: new WebUrlSearcher(),
                validator: new WebUrlInputValidator(),
            },
            {
                searcher: new CustomCommandSearcher(config.customCommands, iconSet.shortcutIcon),
                validator: new CustomCommandInputValidator(config.customCommands),
            },
            {
                searcher: new SearchPluginsSearcher(config, countManager, iconSet, environmentVariableCollection),
                validator: new SearchPluginsInputValidator(),
            },
        ];
    }

    public getCombinations(): InputValidatorSearcherCombination[] {
        return this.combinations;
    }
}
