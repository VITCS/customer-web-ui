import React from 'react';
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';

const Careers = () => (
  <div>
    {/* <h1>Careers Page</h1> */}
    <Box
      className="blockBg"
      w="100%"
      borderRadius="xl"
      boxShadow="lg"
      p="5"
      pb="30"
    >
      <Flex
        mb="3"
        direction={{ base: 'column', lg: 'row' }}
        justifyContent="space-between"
      >
        <Heading as="h1" fontSize="xl">
          Careers
        </Heading>
      </Flex>
      <br />
      <Flex direction={{ base: 'column', lg: 'column' }}>
        <div>
          <Text mb="0" textTransform="uppercase" fontWeight="bold">
            Technical Project manager
          </Text>
          <Grid columns={12} p="3" m="2" mb="3" mt="0">
            <UnorderedList pl="5">
              <ListItem>
                Interact with stakeholders to understand and participate in
                defining the vision and ensure project resources are optimally
                utilized to achieve business outcomes.{' '}
              </ListItem>
              <ListItem>
                Build, lead, direct and manage, groom, coach the team and ensure
                required technology expertise for the project.{' '}
              </ListItem>
              <ListItem>
                Facilitate and coach the teams with technology tools identified
                for infrastructure provisioning, development, configuration,
                deployment, validation teams, and systems support.{' '}
              </ListItem>
              <ListItem>
                Work with Functional heads for business analysis, Technical &
                Solutions architects for defining technology stack required to
                develop, execute, operationalize software applications for cross
                functional teams of organization.{' '}
              </ListItem>
              <ListItem>
                Understand and evaluate 3rd party providers offering digital
                capabilities as service that can be integrated with platform –
                Payment gateways, location services, etc.{' '}
              </ListItem>
              <ListItem>
                Bring in metrics and measurement system to track progress of
                development in line with budget and timelines.{' '}
              </ListItem>
              <ListItem>
                Ensure the application/ product / platform functional and
                non-functional requirements of the platform / product are
                measured, validated & delivered as per product roadmap and
                release plan.{' '}
              </ListItem>
              <ListItem>
                Provide necessary support to Operational teams for onboarding,
                training, supporting in resolving functional and non-functional
                aspects of the platform / product.{' '}
              </ListItem>
              <ListItem>
                Bring in experience developing Cloud native applications on AWS
                or Azure or GCP, API Life cycle management – produce & consume,
                3rd party integration and API technologies like REST & GraphQL.{' '}
              </ListItem>
              <ListItem>
                Direct the teams with reusable libraries, frameworks, low-code
                or no-code platform for rapid development.{' '}
              </ListItem>
              <ListItem>
                Well versed with Agile methodologies and project management
                tools – JIRA, Confluence, Microsoft Project, Visio and MS-Office
                products.{' '}
              </ListItem>
            </UnorderedList>
          </Grid>
        </div>

        <div>
          <Text mb="0" textTransform="uppercase" fontWeight="bold">
            Project Manager
          </Text>
          <Grid columns={12} p="3" m="2" mb="3" mt="0">
            <UnorderedList pl="5" mb="3">
              <ListItem>
                Responsible for Deliverables management, resource management,
                communications management, cost management along with delivery
                timelines, and risk management.{' '}
              </ListItem>
              <ListItem>
                Own and deliver internal systems and integrations with external
                SaaS providers including initial setup for technology to
                integrate and ongoing co-ordination.{' '}
              </ListItem>
              <ListItem>
                Implement CRM and self-support knowledge base oriented community
                platform for both partners and customers.{' '}
              </ListItem>
              <ListItem>
                Execute project adhering to agile methodology – scrums, sprint
                planning, release schedUnorderedListes, sprint retrospectives
                and reviews.{' '}
              </ListItem>
              <ListItem>
                Build, lead, direct and manage, groom, coach & facilitate the
                team on processes, tools & technologies required{' '}
              </ListItem>
              <ListItem>
                Facilitate and coordinate with business teams, Product owners,
                sponsor, Operations team, solution architects, 3rd party
                vendors, development teams, validation team, DevOps teams and
                Operations teams from gathering requirements to implement &
                operate.{' '}
              </ListItem>
              <ListItem>
                {' '}
                Own and foster cUnorderedListture of innovation and continuous
                improvement, promote and ensure development of systems in
                iterations while delivering the incremental business value.{' '}
              </ListItem>
              <ListItem>
                Provide guidance and track deliverables from Business,
                technical, data engineering, and operations teams.{' '}
              </ListItem>
              <ListItem>
                {' '}
                Drive entire team towards common vision and towards overall
                platform launch{' '}
              </ListItem>
              <ListItem>
                {' '}
                Track and report progress, deviations, and observations to
                business stakeholders on overall implementation of internal
                systems, integration, data engineering and implementation CRM
                activities.{' '}
              </ListItem>
            </UnorderedList>
            <p>
              <strong>Technology / Tools:</strong> JIRA, MS-Excel, Microsoft
              Teams, Draw.io/ PowerPoint/ Visio, SharePoint sites, and other
              Productivity tools
            </p>
          </Grid>
        </div>

        <div>
          <Text mb="0" textTransform="uppercase" fontWeight="bold">
            Cloud Solutions Architect
          </Text>
          <Grid columns={12} p="3" m="2" mb="3" mt="0">
            <UnorderedList pl="5" mb="3">
              <ListItem>
                Define Solution Architecture for cloud native applications for
                implementing both functional and non-functional requirements{' '}
              </ListItem>
              <ListItem>
                Assess, compare, considering open source & cloud native
                services, and define solutions for very specific business
                use-cases or required capabilities{' '}
              </ListItem>
              <ListItem>
                Providing the business with choices for Application level,
                standards-based integrations level, data persistence level
                proven architectural patterns-based solutions{' '}
              </ListItem>
              <ListItem>
                Act as SME for Modern event-driven application integration
                architectural patterns, integration technologies, and available
                services from cloud provider or 3rd party API providers{' '}
              </ListItem>
              <ListItem>
                Support development team with Implementing the architecture
                defined using best practices offered by Cloud service providers
                on capabilities, constraints, limitation on opinionated services
                available.{' '}
              </ListItem>
              <ListItem>
                {' '}
                Participate in competency improvement programs at organisations
                level and propagate best practices offered by Cloud service
                provider{' '}
              </ListItem>
              <ListItem>
                {' '}
                Define architecture adhering to opinionated principles –
                reliability, security, performance, cost, and operational
                effectiveness.{' '}
              </ListItem>
              <ListItem>
                Technical ownership during all phases – Define, Build, Operate,
                and iterate the solution{' '}
              </ListItem>
              <ListItem>
                {' '}
                Develop Proof of Concepts (POCs) to provide guidance to
                Development teams{' '}
              </ListItem>
              <ListItem>
                {' '}
                Support DevOps teams for implementing CICD, Monitoring, and
                Automation for remediation.{' '}
              </ListItem>
            </UnorderedList>
            <p>
              <strong>Technologies/ Frameworks/ Toolset: </strong> AWS/ Azure /
              GCP, Javascript based fUnorderedListl stack, Web development
              technologies, RDBMS & NoSQL databases, Data Engineering pipelines
              / Data warehousing technologies with both ETL and Analytics,
              Standards based authentication frameworks – OpenID/ SAML 2.0/
              WebIdentity, CICD Pipeline tools – Jenkins, AWS Code Pipeline.
            </p>
          </Grid>
        </div>

        <div>
          <Text mb="0" textTransform="uppercase" fontWeight="bold">
            Quality Engineer – Software
          </Text>
          <Grid columns={12} p="3" m="2" mb="3" mt="0">
            <UnorderedList pl="5" mb="3">
              <ListItem>
                {' '}
                Prepare test cases and test data based on business requirements{' '}
              </ListItem>
              <ListItem>
                Participate in all scrum meetings, sprint planning meetings,
                release management and other ceremonies to understand validation
                requirements and provide status on validation related activities{' '}
              </ListItem>
              <ListItem>
                Work closely with Product Owners, development teams, DevOps
                teams for defect reporting, tracking to closure, test
                automation, metrics collection & reporting{' '}
              </ListItem>
              <ListItem>
                Develop regression test cases, support regression test
                automation, test bed creation, provide inputs for automated
                testing stage of CICD pipeline{' '}
              </ListItem>
              <ListItem>
                Execute test cases to cover both functional and non-functional
                requirements – Manual & Automated{' '}
              </ListItem>
              <ListItem>
                {' '}
                Execute test cases & Validate – User Experience (GUI), data
                processing / functional logic, and data persistence{' '}
              </ListItem>
              <ListItem>
                {' '}
                Use test automation tools/ frameworks for bringing in test
                efficiency and improving testing cycle times for overall team
                level turnaround{' '}
              </ListItem>
              <ListItem>
                Bring in experience in validating Web applications/ Mobile
                applications / Enterprise Integrations{' '}
              </ListItem>
              <ListItem>
                {' '}
                Automate frontend part of the web / mobile application using
                React / VUE / Any other frontend technologies{' '}
              </ListItem>
            </UnorderedList>
            <p>
              <strong>Technologies / Tools: </strong> JIRA, V-Model, TestNG
              Framework, Selenium, or any other test automation tool.
            </p>
          </Grid>
        </div>

        <div>
          <Text mb="0" textTransform="uppercase" fontWeight="bold">
            DevOps Engineer
          </Text>
          <Grid columns={12} p="3" m="2" mb="3" mt="0">
            <UnorderedList pl="5" mb="3">
              <ListItem>
                {' '}
                Setup and maintain GIT based version control system, and
                implement workflow and branching strategies{' '}
              </ListItem>
              <ListItem>
                Setup Automated CICD pipelines for Build, Automated test stage,
                and deployment{' '}
              </ListItem>
              <ListItem>
                Setup CICD pipelines using 3rd party tools, or Cloud native
                tools – Jenkins, AWS Code Pipeline{' '}
              </ListItem>
              <ListItem>
                Deployment of artifacts into a server-based applications and/ or
                container based microservices environment{' '}
              </ListItem>
              <ListItem>
                Setup & Configure Docker / Kubernetes container orchestration
                tools{' '}
              </ListItem>
              <ListItem>
                {' '}
                Implement cookbooks in Chef & Puppet for automated blue/ green
                deployments{' '}
              </ListItem>
              <ListItem>
                {' '}
                Develop scripts in Python for basic automation related to DevOps
                functions{' '}
              </ListItem>
              <ListItem>
                Participate in all scrum meetings, sprint planning meetings,
                release management and other ceremonies to understand DevOps
                requirements and provide support to development teams during
                releases{' '}
              </ListItem>
              <ListItem>
                {' '}
                Work closely with test architect to implement automated testing
                stage in CICD Pipeline{' '}
              </ListItem>
            </UnorderedList>
            <p>
              <strong>Technologies / Tools: </strong> Python, Jenkins, Chef&
              Puppet, AWS Code Pipeline, JIRA
            </p>
          </Grid>
        </div>

        <div>
          <Text mb="0" textTransform="uppercase" fontWeight="bold">
            Data Analyst
          </Text>
          <Grid columns={12} p="3" m="2" mb="3" mt="0">
            <UnorderedList pl="5" mb="3">
              <ListItem>
                {' '}
                Work closely with business owners - Gather requirements on
                continuous basis to cover initial, future and business event
                level reporting and dashboarding/ visualization needs{' '}
              </ListItem>
              <ListItem>
                Work with application and data engineering teams to understand
                data model, business processes and data engineering pipelines
                implemented{' '}
              </ListItem>
              <ListItem>
                Define and implement statistical models to provide
                visualizations on variance between intended vs actual outcomes{' '}
              </ListItem>
              <ListItem>
                Own and ensure data integrity and data quality across multiple
                systems generating transactional & analytical data{' '}
              </ListItem>
              <ListItem>
                Proactively build automation for data validation and data
                quality issues that enable development teams to fix these at
                root level{' '}
              </ListItem>
              <ListItem>
                {' '}
                Define and manage process to report data integrity and quality
                issues with development team with focus on remediation{' '}
              </ListItem>
              <ListItem>
                {' '}
                Implement self-support systems and process for business owners
                to generate dashboards on schedUnorderedListed frequency or
                on-demand using visualization tools{' '}
              </ListItem>
              <ListItem>
                Perform validation and analysis on the data engineering process
                & data generated to enhance effectiveness of data governance
                systems in place
              </ListItem>
              <ListItem>
                {' '}
                Implement machine learning algorithms to provide pro-active
                insights from data, and select model that gives best possible
                business outcome for given parameters{' '}
              </ListItem>
              <ListItem>
                {' '}
                Participate in all scrum meetings, sprint planning meetings,
                release management and other ceremonies to ensure changes to
                data model, data engineering, warehousing requirements{' '}
              </ListItem>
            </UnorderedList>
            <p>
              <strong>Technologies / Tools: </strong> JIRA, Tableau/
              Graphana/Kibana, Python, SQL, and Statistical modelling.
            </p>
          </Grid>
        </div>

        <div>
          <Text mb="0" textTransform="uppercase" fontWeight="bold">
            Test Architect
          </Text>
          <Grid columns={12} p="3" m="2" mb="3" mt="0">
            <UnorderedList pl="5" mb="3">
              <ListItem>
                {' '}
                Work with stake holders to come up with test strategy,
                automation requirements, framework selections for both API & UI
                testing
              </ListItem>
              <ListItem>
                Define and own QA automation solution for test automation –
                Functional testing cases, regression and automated testing stage
                with manual approval step in CICD pipeline{' '}
              </ListItem>
              <ListItem>
                Define and implement metrics to measurement validation and
                effectiveness of the validation process on overall delivery
              </ListItem>
              <ListItem>
                Define and implement regression test bed and automated test
                stage part of CICD pipeline{' '}
              </ListItem>
              <ListItem>
                Provide strategy & direction to test web applications & mobile
                applications – developed as Single Page Applications (SPA){' '}
              </ListItem>
              <ListItem>
                {' '}
                Oversee test cases preparation, execution, bug reporting and
                tracking to close bugs reported with dev teams{' '}
              </ListItem>
              <ListItem>
                {' '}
                Monitor and support team of quality engineers for usage of
                frameworks, automation tools, scripting, metrics to be collected
                for continuous improvement of overall effectiveness of quality
                and hence the overall quality of the deliveries{' '}
              </ListItem>
              <ListItem>
                {' '}
                Participate in all scrum meetings, sprint planning meetings,
                release management and other ceremonies to understand Testing &
                automation requirements and provide support to development teams
              </ListItem>
              <ListItem>
                {' '}
                Provide periodic status reporting to stakeholders on validation
                and its impact on iterative release and delivery management, and
                measures to be taken for continuous improvement
              </ListItem>
            </UnorderedList>
            <p>
              <strong>Technologies / Tools: </strong> JIRA, Selenium, Postman
              for API testing, Cypress for React UI testing framework, Working
              experience on AWS, Any logging frameworks, Jenkins / any other
              CICD Pipeline
            </p>
          </Grid>
        </div>

        <div>
          <Text mb="0" textTransform="uppercase" fontWeight="bold">
            Software Developer – Salesforce CRM
          </Text>
          <Grid columns={12} p="3" m="2" mb="3" mt="0">
            <UnorderedList pl="5" mb="3">
              <ListItem>
                Common Technologies: HTML, CSS and JavaScript, Web services SAOP
                and REST APIs, CI/CD tools - Jenkins{' '}
              </ListItem>
              <ListItem>
                {' '}
                Salesforce Specific technologies: API Callouts from Lightning
                Web Component & Aura Components, Salesforce APIs (SOAP, REST,
                Batch, Streaming, Outbound Messaging, Apex Callouts){' '}
              </ListItem>
              <ListItem>
                Salesforce specific Integration techniques: publish Data to
                External system using Platform Events, Push Topics and Change
                Data Capture Events{' '}
              </ListItem>
              <ListItem>
                Data Management tools: Data manipulation & Export / import
                relational records using DX and Data Loader{' '}
              </ListItem>
              <ListItem>
                Deployment specific to Salesforce: Develop solutions on
                force.com platforms, including Force.com, Visual force,
                Lighting, LWC, Apex, Web Services API’s.{' '}
              </ListItem>
              <ListItem>
                Require proven strong working experience on Salesforce SaaS
                offerings / Cloud offerings: marketing Cloud & Service Cloud{' '}
              </ListItem>
              <ListItem>
                Marketing cloud: Campaign management, Lead capturing, Coupon
                generations, Mobile Studio, Social studio{' '}
              </ListItem>
              <ListItem>
                Service Cloud: Knowledge base, Article management, Case
                management, Case management through web & Email interfaces. Auto
                response Rules.{' '}
              </ListItem>
              <ListItem>
                Salesforce Communities: Help Center & Partner collaboration{' '}
              </ListItem>
            </UnorderedList>
            {/* <p><strong>Technologies / Tools: </strong>  JIRA, Selenium, Postman for API testing, Cypress for React UI testing framework, Working experience on AWS, Any logging frameworks, Jenkins / any other CICD Pipeline</p> */}
          </Grid>
          <h6>
            If your qualifications match our requirements and believe that you
            can be part of our team, please apply online or e-mail your detailed
            resume to{' '}
            <strong>
              <a href="mailto:careers@1800spirits.com.com">
                {' '}
                careers@1800spirits.com.com
              </a>
            </strong>
          </h6>
        </div>
      </Flex>
      {/* <Text as="span" color="brand.lightgrey">
                (Displaying 20 results based on your search)
              </Text> */}
    </Box>
  </div>
);
export default Careers;
