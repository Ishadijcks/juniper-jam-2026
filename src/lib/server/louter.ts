import { Louter, LouterValidator, LouterYamlParser } from '@123ishatest/louter';
import { LouterFileLoader, LouterJsonSchemaWriter } from '@123ishatest/louter/node';
import { engine } from '$lib/game/game.svelte';

export const parseContent = async () => {
  const louter = new Louter([
    // Loads all files in the specified folder
    new LouterFileLoader('static/games'),

    // Parses the YAML that was found
    new LouterYamlParser(),

    // Validates it against the schemas
    new LouterValidator(),

    new LouterJsonSchemaWriter(),
  ]);

  const result = louter.run(engine.content);

  // Check for warnings
  if (result.warnings.length > 0) {
    result.warnings.forEach(console.warn);
  } else {
    console.log('All content parsed correctly!');
  }

  return result.content;
};
