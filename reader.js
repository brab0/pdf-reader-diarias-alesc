var PdfReader = require('pdfreader/PdfReader'),
    globbedPaths = require('./globbedPaths.js'),
    json2xls = require('json2xls'),
    fs = require('fs'),
    flatiron = require('flatiron'),
    app = flatiron.app;

var pdfs = [];

var files = [];

var now = new Date();

var name = (parseInt(now.getTime())).toString(36);

var formatCurrency = function(text){
  var strMoney = text.replace("R$", "").trim();
  var arrMonney = strMoney.split(",");

  if(arrMonney.length > 1){
    arrMonney[0] = arrMonney[0].replace(".", ",");
  }

  return arrMonney.join(".");
}

var setPdf = function(item, objs){

  if (objs.index == 0){
    objs.pdf.file = item.file.path;
  } else if (objs.index == 3){
    objs.pdf.titulo = item.text;
  } else if(objs.index == 6){
    objs.pdf.secretaria_entidade = item.text;
  } else if(objs.index == 7){
    objs.pdf.orgao_setor = item.text;
  } else if(objs.index == 10){
    objs.pdf.endereco = item.text;
  } else if(objs.index == 11){
    objs.pdf.municipio = item.text;
  } else if(objs.index == 15){
    objs.pdf.nome = item.text;
  } else if(objs.index == 16){
    objs.pdf.matricula = item.text;
  } else if(objs.index == 18){
    var periodo = item.text.split(" ");
    objs.pdf.data_inicial = periodo[0];
    objs.pdf.data_final = periodo[2];
  }

  if(item.text == "DIÁRIAS A PERCEBER"){
    objs.itinerario = false;
  }

  if(objs.itinerario){
    objs.arrItinerario.push(item.text);
    objs.pdf.itinerario = objs.arrItinerario.join(" /")
  }

  if(item.text == "ITINERÁRIO"){
    objs.motivo_viagem = false;
    objs.itinerario = true;
    objs.arrItinerario.push("");
  }

  if(objs.motivo_viagem){
    objs.arrMotivoViagem.push(item.text.replace("- ", ""));
    objs.pdf.motivo_viagem = objs.arrMotivoViagem.join(" / ");
  }

  if(item.text == "MOTIVOS DE VIAGEM"){
    objs.arrMotivoViagem.push("");
    objs.motivo_viagem = true;
  }

  if(parseInt(24 + objs.arrMotivoViagem.length + objs.arrItinerario.length) == objs.index){
    if((item.text !="TOTAL GERAL")&&(item.text != "TOTAL")){
      objs.pdf.deslocamento = item.text
    }
  } else if(parseInt(25 + objs.arrMotivoViagem.length + objs.arrItinerario.length) == objs.index){
    if(objs.pdf.deslocamento != ""){
      objs.pdf.quantidade = item.text.replace(",", ".")
    }
  } else if(parseInt(26 + objs.arrMotivoViagem.length + objs.arrItinerario.length) == objs.index){
    if(objs.pdf.deslocamento != ""){
      objs.pdf.valor_unitario = formatCurrency(item.text);
    }
  } else if(parseInt(27 + objs.arrMotivoViagem.length + objs.arrItinerario.length) == objs.index){
    if(objs.pdf.deslocamento != ""){
      objs.pdf.total = formatCurrency(item.text);
    }
  } else if(parseInt(29 + objs.arrMotivoViagem.length + objs.arrItinerario.length) == objs.index){
    if(objs.pdf.deslocamento != ""){
      objs.pdf.total_geral = formatCurrency(item.text);
    }
  }
}

var clearObjs = function(){
  return {
    pdf : {
      file : "",
      titulo : "",
      secretaria_entidade : "",
      orgao_setor : "",
      endereco : "",
      municipio : "",
      nome : "",
      matricula : "",
      data_inicial : "",
      data_final : "",
      motivo_viagem : "",
      itinerario : "",
      deslocamento : "",
      quantidade : 0,
      valor_unitario : 0.0,
      total : 0.0,
      total_geral : 0.0
    },
    motivo_viagem : false,
    itinerario : false,
    arrMotivoViagem : [],
    arrItinerario : [],
    index : 0
  }
}

var readPdf = function(currentIndexFile){

  var objs = clearObjs();

  console.log(parseInt(currentIndexFile + 1) + " - " + files.length + ": Lendo arquivo " + files[currentIndexFile])

  new PdfReader().parseFileItems(files[currentIndexFile], function(err, item){

    if (!item){

      pdfs.push(objs.pdf);

      if(currentIndexFile == parseInt(files.length - 1)){
        var xlsx = json2xls(pdfs);

        fs.writeFileSync('sheets/'+ name + '.xlsx', xlsx, 'binary');

        console.log("\n");
        console.log("Fim da Execução. " + files.length + " PDFs convertidos com successo.")
        console.log("Abrao arquivo " + name + ".xlsx na pasta sheets dentro do projeto.!!!")
        console.log("\n");

      } else{
        readPdf(currentIndexFile + 1);
      }
    } else {
      setPdf(item, objs);
    }

    objs.index++;
  });
}

var prompt = require('prompt');

prompt.start();
console.log('\n');
prompt.get(['path'], function (err, result) {

  files = globbedPaths.get(result.path + "/*.pdf");

  readPdf(0);
});
