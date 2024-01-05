## Project structure

### Stack/automation-tools

1. gatsby
2. apollo-client/mst
3. graphql-code-gen/ampliy codegen
4. chakra-ui

### directory structure

1. pages/
   [page-name].(js|tsx)
   Will contain layout files. Each of this .tsx/.js file will represent a page in app.

2. components/
   /[component-name]
   index.(tsx|js)
   [component-name].test.ts
   Will contain component files. This file will include independant component logic and types.

3. graphql/
   /[page-name] (/[component-name])

   1. This .graphql file consists of queries , mutations and subscriptions of respective file-name'd page or component.

4. stories
   /[page-name] (/[component-name])/ [component_name].test.(tsx|js)
   This .story.(js|tsx) file consists of documentation of component and its behaviour with respective props.

5. models/
   /[model-name].(js|tsx)
   This model file repesent data shape and actions. This file consists to api integrations.

## Workflow

This workflow prioritise stable and predictable code over quick development time. Consider sequence of actions to fulfill your assignments.

1. Ticket assgiend to dev.
2. Analysis and make a test process to evalute result.
3. Write a .test.js with snapshot and user behaviour if needed.
4. work on code to fulfill test cases.
5. push to [your-name] branch.
6. create merge request for review and merge.
