# TODO's LIST 

## TABLE OF CONTENTS

[New features and technical debits](#New-features-and-technical-debits)

[Standards](#Standards)

[Autenticação](#Autenticação)

[Frontend](#Frontend)

[DevOps CI/CD](#DevOps-CI-CD)

[SRE Observality](#SRE-Observality)

[Melhorias de aplicação e regras de negócio](#Melhorias-de-aplicação-e-regras-de-negócio)


## New-features-and-technical-debits
TODO: 1. manter o README.md constantemente atualizado!

2. migrar esta lista de TODOs para um arquivo TODO.md - DONE

TODO: 3. se abituar a criar branches separadas por features/melhorias, criando PRs para a main

TODO: 4. traduzir todo o projeto para o Inglês, incluindo a padronização de código, endpoints, collection, etc.

TODO: 5. modularizar (com os mesmos paradigmas dos projetos de automação) cada CRUD e a escuta do servidor

TODO: 6. resolver os problemas de código do projeto (via Inspect Code), pesquisando

TODO: 7. refatorar de forma que os endpoints suportem um ou mais registros no mesmo payload, quando aplicável (e.g. in post method)

TODO: 8. realizar tratamentos de violações de integridade dos relacionamentos da base de dados de forma que o server não caia quando, por exemplo, deixarmos de enviar um campo não nulo em uma integração

TODO: 9. criar uma entidade de pedidos, com relacionamentos com as existentes, alterando a estrutura de automação de criação de banco de dados (Ansible playbooks) e incrementando a Postman collection

## Standards

TODO: 10. definir, documentar e implementar:  
Design Pattern;
Code Formatters (ESLint, como nos projetos de automação);
Standardizations and Technical Guidelines (como nos README.md das automações);
The definition of standards (camelCase for variables, kabab-case for files, and so on);
Helper Classes, Helper Functions;
use of JDoc in functions;
etc.

TODO: 11. migrar os scripts para TypeScript

TODO: 12. pesquisar implementar uma tabela de controle de versionamento de banco de dados de forma que, a cada atualização na estrutura de base de dados, cresça um id de versão, e estas atualizações de versão sejam por queries PostgreSQL

## Autenticação

TODO: 13. implementar autenticação por token nas APIs

TODO: 14. implementar cadastro de usuários

TODO: 15. implementar hash no password

TODO: 16. implementar perfis de acesso

TODO: 17. implementar comms com o protocolo https

## Frontend

TODO: 18. criar um projeto de frontend. Desenhar telas e fluxos, incluindo uma tela de ped
Se basear em: https://chat.openai.com/share/e5aa4258-e063-4002-956d-ec6b4fbbbb81

TODO: 19. separar os serviços de backend dos submódulos do frontend

TODO: 20. implementar um testing Framework (e.g. Cypress) eventually for the frontend

## DevOps-CI-CD

TODO: 21. estudar a criação de uma imagem Docker para ser publicada em um Docker Registry (no Docker Hub?) contendo a aplicação, b

TODO: 22. estudar o uso de pipelines CI, CD (utilizando uma imagem Jenkins?) e publicação em Nuvem (GCP?/AWS? com cotas grátis)

## SRE-Observality

TODO: 23. implementar um sistema de logs de aplicação em arquivo

TODO: 24. Implementar server e agent de tests de ambiente (e.g. Zabbix, log elastich search, etc.) para ficar testando a disponibilidade e saúde da aplicação, banco de dados, portas, etc.

## Melhorias-de-aplicação-e-regras-de-negócio

TODO: 25. estudar sobre restrições de entidades por parâmetros (criando tabelas relacionadas para tal):
modificar o método de exclusão de registros de entidades para, caso for excluído, não seja excluído de fato da base de dados, mas apenas inativado (uma nova coluna de status em todas as entidades);
modificar a estrutura da tabela localities, de forma a possuir um código de cnpj único (primary key), alterando a estrutura de automação de criação de banco de dados (Ansible playbooks) e incrementando a Postman collection (neste caso, gerando cnpjs válidos automaticamente para os testes);
modificar a estrutura da tabela vehicles, de forma a possuir um código identificador de veículo único (como um renavam) (primary key), alterando a estrutura de automação de criação de banco de dados (Ansible playbooks) e incrementando a Postman collection (neste caso, gerando códigos válidos automaticamente para os testes);
modificar a estrutura da tabela carriers, de forma a possuir um código de cnpj único (primary key), alterando a estrutura de automação de criação de banco de dados (Ansible playbooks) e incrementando a Postman collection (neste caso, gerando cnpjs válidos automaticamente para os testes);
modificar a estrutura da tabela trips, de forma a possuir um código numérico único (primary key), alterando a estrutura de automação de criação de banco de dados (Ansible playbooks) e incrementando a Postman collection (neste caso, gerando códigos númericos válidos automaticamente para os testes, incremental, consultando o último código existente e incrementando um número) (o id da entidade não precisa e nem deve ter o mesmo código de viagem, porém este último deve ser sequencial);
criar uma tabela de placas e respectivo relacionamento com veículo
criar tipos de veículos e associa-las aos veículos;
criar uma frota de veículo e associá-la a uma transportadora;
criar categorias de produtos e associa-las aos produtos;
restrição de um único veículo por vez reservado para uma única viagem;
criar tabelas com todos os estados e cidades do Brasil e associa-las às localidades;
docas de carregamento e descarregamento nas localidades (dias de funcionamento?);
restrições de localidade (por exemplo, recorte de ZMRV) por uma transportadora/veículo;
criar um tabela de papéis/tipos logísticos de localidade e associá-los com os registros de localidade existentes
cálculo de frete utilizando uma tabela por distancia);
geolocalização (utilizando um bd postgis) para cálculo de rota via API do Google, e;
cálculo de duração da viagem;
introduzir status de viagem (planejada, liberada, em execução, concluída, cancelada);
criar uma tabela de motoristas e respectivo relacionamento com a viagem (em execução), de forma a possuir um código de cpf único (primary key), alterando a estrutura de automação de criação de banco de dados (Ansible playbooks) e incrementando a Postman collection (neste caso, gerando cpfs válidos automaticamente para os testes);
criar uma tela para monitoramento de status de viagens;
etc.