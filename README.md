# PDF Reader - Diárias da Alesc
Leitor específico para PDFs de diárias das Alesc

## ShellScript pra baixar os PDFs
https://github.com/escola-de-dados/alesc-baixador-diarias

## Instalação e Execução do Leitor (Testado no Ubuntu & Mac)
- Para baixar o projeto, preparar ambiente, instalar dependencias e executar,
siga as instruções abaixo e execute no terminal:

```html
˜# git clone https://github.com/brab0/pdf-reader-diarias-alesc.git && cd pdf-reader-diarias-alesc.git
˜# chmod +x start.sh && ./start.sh
```

- Caso o primeiro passo já tenha sido feito e deseje executar novamente a
aplicação, execute no terminal:
```html
˜# ./start.sh
```

Após a inicialização, o aplicativo irá pedir para você informar o caminho
onde os arquivos se encontram. Abra outra aba no terminal, vá até onde seus PDFs
se encontram(cd /path/to/pdfs/) e digite o comando abaixo:
```html
˜# pwd
```

...o resultado será algo como:
```html
˜# /Users/Rodrigo/Desktop
```

...copie o caminho e cole no programa.
