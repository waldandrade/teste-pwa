# pwa2

## GERAL

PÚBLICO-ALVO: alunos de métodos formais, profissionais e pesquisadores que desejam criar ou editar especificações formais em LOTOS

ENTRADA PARA A SOLUÇÃO: especificação formal em LOTOS

### INTRODUÇÃO

Por décadas, a indústria de hardware e software vem passando por transformações afim de tornar as estratégias de desenvolvimento mais ágeis e eficientes, em contrapartida, um esforço proporcional deve ser feito para aprimorar as metodologias de garantia de eficácia dos produtos criados. Métodos como desenvolvimento orientado a testes (DTD) podem ser utilizados para se reduzir as ocorrências de falhas e comportamentos não previstos, mas para sistemas críticos - soluções de hardware ou software cujas falhas significam perdas de vidas ou consequências financeiras graves - as técnicas de especificação formal são mais indicadas por que garantem matematicamente que a solução a ser desenvolvida atenderá a demanda, obedecendo a todos os requisitos que garantiram a tolerância a falha mais adequada. Lotos (ISO, 1989) é, dentre estas técnicas, uma que mostrou bons resultados na indústria sendo bastante utilizada para especificações de ... A viabilidade do Lotos é discutível graças a sua alta complexidade, que resulta em uma longa curva de aprendizagem, sendo adotada apenas por projetistas e pesquisadores avançados (Referencia ao artigo LOTOS ao LNT). Desde que se tornou um padrão ISO, as multas tentativas de melhorar o Lotos não surtiram muito efeito, até que a linguagem LNT foi criado para oferecer uma forma simplificada de criar especificações em Lotos. O CADP (XYZ, 9999), um conjunto de ferramentas de compilação e processamento de especificações escritas em Lotos, oferece um tradutor de LNT para Lotos, para não seja necessário aprender Lotos para contar com os recursos da linguagem - um tradutor é um compilador que recebe um código em uma linguagem de origem, realiza análises e otimizações, e por fim entrega um código traduzido para a linguagem de destino.

Ferramentas para edição de código tornaram-se cruciais para o desenvolvimento de hardware e software. Softwares como o Visual Code (Referencia) oferecem recursos de organização, colaboração, estilos e apoio à linguagem que auxiliam estudantes e desenvolvedores durante a curva de aprendizagem, e permitindo que os mesmos deem foco ao que mais importa: a resolução de problemas. Já com o Lotos, e atualmente com o LNT, não foram desenvolvidas ferramentas de edição com recursos como os mecionados acima, o que, acredita-se, impacta diretamente na aceitação de estudantes e proficionais a linguagem, e impacta indiretamente a indústria que não encontra profissionais capacitados.

Por esse motivo, foi desenvolvimento o JLotos, uma ferramenta de edição de códigos open-source, totalmente web, colaborativa que oferece recursos de organização, estilos e apoio à linguagem além de oferecer um analisador léxico, sintático e semântico que dá respostas ao usuário durante a codificação.

## LINGUAGEM LNT

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).