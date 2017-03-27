#!/bin/sh
sudo true

[ "$(which npm)" != "" ] && has_npm=true || has_npm=false
[ "$(which node)" != "" ] && has_node=true || has_node=false
[ "$(which brew)" != "" ] && has_brew=true || has_brew=false
[ -d "node_modules" ] && has_dependencies=true || has_dependencies=false

if [ $has_brew == false ]; then
    read -p "Instalar o Homebrew [s/n]?" answer < /dev/tty
    if [[ "$answer" == [Ss]* ]]; then
        echo "Installing Homebrew..."
        /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    fi
fi

if [ $has_node == false ]; then
    read -p "Este projeto precisa de NodeJs. Posso instalar [s/n]? " answer < /dev/tty
    if [[ "$answer" == [Ss]* ]]; then
        echo "Installing NodeJs..."
        brew install node
        has_node=true
        echo "Installing NPM..."
        curl http://npmjs.org/install.sh | sudo npm_debug=1 clean=no PATH=$PATH sh
        has_npm=true
        echo "...NPM version $(npm --version) installed!"

        sudo npm cache clean -f
        sudo npm install -g n
        sudo n stable
        clear
        echo "...NodeJs version $(node --version) installed!"
    fi
fi

if [ $has_npm == true ]; then
  if [ $has_dependencies == false ]; then
    read -p "Instalar pacotes do projeto [s/n]? " answer < /dev/tty
    if [[ "$answer" == [Ss]* ]]; then
      sudo npm install
      has_dependencies=true
      clear
    else
        echo "Sem as dependencies não é possível rodar o leitor."
    fi
  fi
else
    echo "Ops..."
fi

if [ $has_npm == true ]; then
  if [ $has_node == true ]; then
    if [ $has_dependencies == true ]; then
      read -p "Quer converter os PDFs agora [s/n]? " answer < /dev/tty
      if [[ "$answer" == [Ss]* ]]; then
        clear
        npm start
      else
        echo "ok!!!"
      fi
    fi
  fi
else
    echo "ops..."
fi
