//Grade de produtos

var FC_posIDProduto=0;
var FC_posEstoque=2;
var FC_posIniDescritor=9;
var FC_QtdDescritores=2;  //Alterado de 4 para 2 pois esta loja utiliza apenas cor e tamanho
var SeparadorRGBCor="|";

function FC_fDistintos(aDados,iCampo,aDistintos){
//Retorna array de valores distintos não vazios
  for(var i=0;i<aDados.length;i++){
    var j=0,JaTem=false;
    while(j<aDistintos.length && !JaTem){
      JaTem=(aDistintos[j]==aDados[i][iCampo]);
      j++;
    }
    if(!JaTem)aDistintos[aDistintos.length]=aDados[i][iCampo];
  }
}

function FC_fExisteDescritor(aDados,iCampo,ValorCampo,iCampoDisp,aValoresDisp){
//Retorna array de descritores disponíveis do descritor informado
  for(var i=0;i<aDados.length;i++){
    if(aDados[i][iCampo]==ValorCampo)aValoresDisp[aValoresDisp.length]=aDados[i][iCampoDisp];
  }
}

function FC_fSubProdSelec(IDProduto,aDados,aDistintos){
//Informa o ID do sub-produto com as características selecionadas nas opções e o seu estoque
//Retorna Existe=false se não encontrar

  var aSelecionados=new Array();
  FC_fSelecionados(IDProduto,aDistintos,FC_QtdDescritores,aSelecionados);

  var i=0,j=0,AcheiSubProd=false;
  while(!AcheiSubProd && i<aDados.length){
    j=ObtemNivelSeguinte(aDistintos,-1);
    var bComparador=true;
    while(bComparador && j!=-1){
      bComparador=(bComparador && aDados[i][j+FC_posIniDescritor]==aSelecionados[j]);
      if(bComparador){j=ObtemNivelSeguinte(aDistintos,j);}
    }
    if(bComparador)AcheiSubProd=true;
    if(!AcheiSubProd)i++;
  }
  if(AcheiSubProd){
    this.IDSubProduto=aDados[i][FC_posIDProduto];
    this.iEstoque=aDados[i][FC_posEstoque];
    this.Cor=aDados[i][FC_posIniDescritor];
    //this.Adicional1=aDados[i][FC_posIniDescritor+1];
    //this.Adicional2=aDados[i][FC_posIniDescritor+2];
    //this.Adicional3=aDados[i][FC_posIniDescritor+3];
    this.AdicionalD1=aDados[i][FC_posIniDescritor+3];
    this.AdicionalD2=aDados[i][FC_posIniDescritor+4];
    this.AdicionalD3=aDados[i][FC_posIniDescritor+3];
    this.PrecoOri=aDados[i][3];//Posição do Preço original do produto no array
    this.PrecoNum=aDados[i][4];//Posição do Preço num do produto no array
  }
  this.Existe=AcheiSubProd;
}

function FC_fRedefineOpcoes(IDProduto,aDados,aDistintos,iCampo,ValorCampo){

  //Marca o selecionado e desmarca os demais
  for(var j=0;j<aDistintos[iCampo].length;j++){
    FC_Option=document.getElementById("FC_liOpcao_"+ iCampo +"_"+ j +"_"+ IDProduto);
    if(aDistintos[iCampo][j]!=ValorCampo){
      FC_Option.style.borderWidth='2px';
      FC_Option.style.borderStyle='solid';
      FC_Option.style.borderColor='white';
    }
    else{
      FC_Option.style.borderWidth='2px';
      FC_Option.style.borderStyle='solid';
      FC_Option.style.borderColor='#888888';
    }
  }

  //Se for cor, altera a foto do produto caso tenha
  if(iCampo==0 && aDados.length>1){
    var i=0,j=0,AcheiFotoProd=false;
    while(!AcheiFotoProd && i<aDados.length){
        AcheiFotoProd=(aDados[i][FC_posIniDescritor]==ValorCampo);
        i++;
      }
    if(bDet){var sSrcFoto=aDados[i-1][7];var sSrcFotoA=aDados[i-1][8]} else{var sSrcFoto=aDados[i-1][6]} 
    if(sSrcFoto!='')document.getElementById("Foto"+ IDProduto).src=sSrcFoto;
    if(sSrcFotoA!='')document.getElementById("hrefFoto"+ IDProduto).href=sSrcFotoA; //Altera a foto do ZOOM de acordo com o produto
  }


    //Mostra cor e tamanho
   if(iCampo==0){
    var aNomeRGB=ValorCampo.split(SeparadorRGBCor);
    var sNomeCor=aNomeRGB[0];
    var sRGBCor=aNomeRGB[1];
    document.getElementById('CorProduto').innerHTML="<b>Cor:</b> "+sNomeCor+"&nbsp; &nbsp; ";
    //document.getElementById('RGBCorProduto').style.backgroundColor='#'+sRGBCor;
    document.getElementById('RGBCorProduto').style.width='20px';
    document.getElementById('RGBCorProduto').innerHTML="<span style='width:15px;background-color:#"+sRGBCor+"'>&nbsp;&nbsp;</span>";

    document.getElementById('TamanhoProduto').innerHTML='';
   }
   else if(iCampo==1){
    document.getElementById('TamanhoProduto').innerHTML="<b>Tamanho:</b> "+ValorCampo;
   }


  var NivelSeguinte=ObtemNivelSeguinte(aDistintos,iCampo);
  if(NivelSeguinte!=-1){  //habilita um nível abaixo
    document.getElementById("FC_idNivel_"+ NivelSeguinte +"_"+ IDProduto).className="NivelOn";
    for(var j=0;j<aDistintos[NivelSeguinte].length;j++){  //habilita opções do nível abaixo
      if(aDistintos[NivelSeguinte][j]!=''){
        var bExisteOpcao=FC_fExisteOpcao(IDProduto,aDados,aDistintos,NivelSeguinte,j);

        FC_Option=document.getElementById("FC_liOpcao_"+ NivelSeguinte +"_"+ j +"_"+ IDProduto);	//pinta o fundo das opções indisponíveis
        if(bExisteOpcao){FC_Option.style.backgroundColor='#CCCCCC';}
        else{FC_Option.style.backgroundColor='white';}

        document.getElementById("FC_oOpcao_"+ NivelSeguinte +"_"+ j +"_"+ IDProduto).disabled=bExisteOpcao;
        document.getElementById("FC_idOpcao_"+ NivelSeguinte +"_"+ j +"_"+ IDProduto).className='estOpcao'+!bExisteOpcao;
        document.getElementById("FC_oOpcao_"+ NivelSeguinte +"_"+ j +"_"+ IDProduto).checked=false;

        FC_Option=document.getElementById("FC_liOpcao_"+ NivelSeguinte +"_"+ j +"_"+ IDProduto);	//desmarca opção selecionada 
        FC_Option.style.borderWidth='2px';
        FC_Option.style.borderStyle='solid';
        FC_Option.style.borderColor='white';

      }
    }   
    for(var i=NivelSeguinte+1;i<FC_QtdDescritores;i++){  //desabilita níveis inferiores
      document.getElementById("FC_idNivel_"+ i +"_"+ IDProduto).className="NivelOff";
      for(var j=0;j<aDistintos[i].length;j++){  //desabilita opções dos níveis inferiores
        if(aDistintos[i][j]!=''){
          document.getElementById("FC_oOpcao_"+ i +"_"+ j +"_"+ IDProduto).disabled=true;
          document.getElementById("FC_idOpcao_"+ i +"_"+ j +"_"+ IDProduto).className='estOpcaotrue';
          document.getElementById("FC_oOpcao_"+ i +"_"+ j +"_"+ IDProduto).checked=false;
        }
      }   
    }
  }
  var oBotao=document.getElementById("FC_oBotao_"+ IDProduto);
  if(NivelSeguinte==-1){  //verifica o ID e o estoque do produto
    var oSubProd=new FC_fSubProdSelec(IDProduto,aDados,aDistintos);
    if(oSubProd.Existe){

       bSubProdSemPreco=false;
      //Altera o preço do produto de acordo com o preço do sub-produto
      if(oSubProd.PrecoNum==0 && oSubProd.PrecoOri==0){
        bSubProdSemPreco=true;
        document.getElementById('PrecoProdPrinc').innerHTML="<span class=EstPrecoProdCapa>sem preço neste item</span>";
        oBotao.style.backgroundImage="url('"+sCaminhoImagens+"BotGridConsultenos.png')";
        oBotao.onclick=new Function('FC_ConsultenosSubProd("'+ oSubProd.IDSubProduto +'","'+oSubProd.Cor+'","'+oSubProd.AdicionalD1+'","'+oSubProd.AdicionalD2+'","'+oSubProd.AdicionalD3+'");');
      }

      if(!bSubProdSemPreco){
        var ParcelamentoJS=MostraMaxParcelaJS(oSubProd.PrecoNum,0);
        if(oSubProd.PrecoNum!=oSubProd.PrecoOri){
         document.getElementById('PrecoProdPrinc').innerHTML="de <strike>"+FormatPrice(oSubProd.PrecoOri,'R$')+"</strike> por <b>"+FormatPrice(oSubProd.PrecoNum,'R$')+"</b> "+ParcelamentoJS;
         }
         else{
         document.getElementById('PrecoProdPrinc').innerHTML="<b>"+FormatPrice(oSubProd.PrecoNum,'R$')+"</b> "+ParcelamentoJS;
         }

        if(oSubProd.iEstoque>0){
          //oBotao.value="Comprar";
          oBotao.style.backgroundImage="url('"+sCaminhoImagens+"BotGridComprar.png')";
          oBotao.onclick=new Function('FC_CompraSubProd("'+ oSubProd.IDSubProduto +'","'+oSubProd.Cor+'",,"'+oSubProd.AdicionalD1+'","'+oSubProd.AdicionalD2+'","'+oSubProd.AdicionalD3+'");');	//Função para comprar o produto
        }
        else{
          //oBotao.value="Produto esgotado. Avise-me";
          oBotao.style.backgroundImage="url('"+sCaminhoImagens+"BotGridEsgotado.png')";
          oBotao.onclick=new Function('MostraDispCaptcha('+IDLojaNum+',"'+oSubProd.IDSubProduto+'");');	//Função para aviso de disponibilidade
        }

      }
      oBotao.disabled=false;
      
    }
    else{
      oBotao.value="n/a";  //não encontrou
      oBotao.disabled=true;
      oBotao.onclick=null;
    }
  }
  else{

    //Volta o preço do produto Pai
    var ParcelamentoJS=MostraMaxParcelaJS(PrecoProdPaiNum,0);
    if(PrecoProdPaiNum!=PrecoProdPaiOri){
     document.getElementById('PrecoProdPrinc').innerHTML="de <strike>"+FormatPrice(PrecoProdPaiOri,'R$')+"</strike> por <b>"+FormatPrice(PrecoProdPaiNum,'R$')+"</b> "+ParcelamentoJS;
     }
     else{
     document.getElementById('PrecoProdPrinc').innerHTML="<b>"+FormatPrice(PrecoProdPaiNum,'R$')+"</b> "+ParcelamentoJS;
     }

    //oBotao.value="Selecione";  //limpa botão
    oBotao.style.backgroundImage="url('"+sCaminhoImagens+"BotGridSelecione.png')";
    oBotao.disabled=true;
    oBotao.onclick=null;
  }
}

function FC_CompraSubProd(IDSubProd,Cor,AdicionalD1,AdicionalD2,AdicionalD3){
  //alert(IDSubProd+'-'+Cor+'-'+Adicional1+'-'+Adicional2+'-'+Adicional3+'-'+AdicionalD1+'-'+AdicionalD2+'-'+AdicionalD3);
  var aNomeRGB=Cor.split(SeparadorRGBCor);
  var sNomeCor=aNomeRGB[0];
  var sURLCompra='AddProduto.asp?IDLoja='+IDLojaGrid+'&IDProduto='+ IDSubProd;
  if(sNomeCor!='')sURLCompra+='&Cor='+ sNomeCor.replace(/\+/g,'%2B');
  //if(Adicional1!='')sURLCompra+='&Adicional1='+ Adicional1;
  //if(Adicional2!='')sURLCompra+='&Adicional2='+ Adicional2;
  //if(Adicional3!='')sURLCompra+='&Adicional3='+ Adicional3;
  if(AdicionalD1!='')sURLCompra+='&AdicionalD1='+ AdicionalD1;
  if(AdicionalD2!='')sURLCompra+='&AdicionalD2='+ AdicionalD2;
  if(AdicionalD3!='')sURLCompra+='&AdicionalD3='+ AdicionalD3;
  //alert(sURLCompra);
  top.location.href=sURLCompra;
}

function FC_ConsultenosSubProd(IDSubProd,Cor,AdicionalD1,AdicionalD2,AdicionalD3){
  //alert(IDSubProd+'-'+Cor+'-'+Adicional1+'-'+Adicional2+'-'+Adicional3+'-'+AdicionalD1+'-'+AdicionalD2+'-'+AdicionalD3);
  var aNomeRGB=Cor.split(SeparadorRGBCor);
  var sNomeCor=aNomeRGB[0];
  var sURLConsultenos='FaleConosco.asp?IDLoja='+IDLojaGrid+'&Assunto=Consulta%20sobre%20produto ('+ IDSubProd +') ';
  if(sNomeCor!='')sURLConsultenos+=' Cor='+ sNomeCor.replace(/\+/g,'%2B');
  //if(Adicional1!='')sURLConsultenos+=' '+ Adicional1;
  //if(Adicional2!='')sURLConsultenos+=' '+ Adicional2;
  //if(Adicional3!='')sURLConsultenos+=' '+ Adicional3;
  if(AdicionalD1!='')sURLConsultenos+=' '+ AdicionalD1;
  if(AdicionalD2!='')sURLConsultenos+=' '+ AdicionalD2;
  if(AdicionalD3!='')sURLConsultenos+=' '+ AdicionalD3;
  //alert(sURLConsultenos);
  top.location.href=sURLConsultenos;
}


function FC_fExisteOpcao(IDProduto,aDados,aDistintos,iNivel,iOpcao){
//retorna false se existe a opção combinada com as opções já selecionadas
  var aSelecionados=new Array();
  FC_fSelecionados(IDProduto,aDistintos,iNivel,aSelecionados);
  aSelecionados[aSelecionados.length]=aDistintos[iNivel][iOpcao];

  var i=0,j=0,AcheiSubProd=false;
  while(!AcheiSubProd && i<aDados.length){
    j=ObtemNivelSeguinte(aDistintos,-1);
    var bComparador=true;
    while(bComparador && j!=-1 && j<aSelecionados.length){
      bComparador=(bComparador && aDados[i][j+FC_posIniDescritor]==aSelecionados[j]);
//alert(aDados[i][j+FC_posIniDescritor]+"="+aSelecionados[j]);
      if(bComparador)j=ObtemNivelSeguinte(aDistintos,j);
    }
    if(bComparador)AcheiSubProd=true;
    if(!AcheiSubProd)i++;
  }
  return !AcheiSubProd;
}

function FC_fSelecionados(IDProduto,aDistintos,iNivel,aSelecionados){
//Retorna array de opções selecionadas até o nível iNivel
  for(var i=0;i<iNivel;i++){
    if(!FC_fIsVazio(aDistintos[i])){
      for(var j=0;j<aDistintos[i].length;j++){
        if(aDistintos[i][j]!=''){
          if(document.getElementById("FC_oOpcao_"+ i +"_"+ j +"_"+ IDProduto).checked){
            aSelecionados[aSelecionados.length]=aDistintos[i][j];
          }
        }
      }
    }
    else {
      aSelecionados[aSelecionados.length]='';
    }
  }
}

function ObtemNivelSeguinte(aDistintos,iCampo){
//retorna índice de array do próximo nível com opções não vazias
//retorna -1 se não existir nível seguinte
  var i=iCampo+1,IsBranco=true;
  while(i<aDistintos.length && IsBranco){
    IsBranco=(FC_fIsVazio(aDistintos[i]));
    if(IsBranco)i++;
  }
  if(IsBranco)return -1;
  else return i;
}

function FC_fIsVazio(aValores){
//retorna true se array aValores só contém string vazia
  var i=0,IsVazio=true;
  while(IsVazio && i<aValores.length){
    IsVazio=(aValores[i]=='');
    if(IsVazio)i++;
  }
  return IsVazio;
}






function FC_fInitProdLista(IDProduto){
//Inicializa arrays e exibe opções de IDProduto
  var FC_aProduto=new Array();
  for(var i=0;i<FC_aSubProd.length;i++)FC_aProduto=FC_aProduto.concat(FC_aSubProd[i]);
  eval("FC_aProduto_"+ IDProduto +"=FC_aProduto");

  var aDistintos=new Array();
  for(var i=0;i<FC_QtdDescritores;i++){
    var aTemp=new Array();
    FC_fDistintos(FC_aProduto,FC_posIniDescritor+i,aTemp);
    aDistintos=aDistintos.concat([aTemp]);
  }
  eval("FC_aDistintos_"+ IDProduto +"=aDistintos");
  
  var NivelSeguinte=ObtemNivelSeguinte(aDistintos,-1);  //procura pelo primeiro nível com opções
  if(NivelSeguinte==-1)return void(0); //alert('Sem opções nos sub-produtos de '+IDProduto);
  else document.write("<div style=font-size:10px;>");

  for(var i=0;i<FC_QtdDescritores;i++){
    if(i==NivelSeguinte){FC_sClass="NivelOn";var sDisabled="";}
    else{FC_sClass="NivelOff";var sDisabled=" disabled";}
    document.write("<table><tr><td><div id=FC_idNivel_"+ i +"_"+ IDProduto +" class="+ FC_sClass +"><ul class=lstColor>");

    if(aDistintos[i].length>0){
      for(var j=0;j<aDistintos[i].length;j++){
        //alert(aDistintos[i][j]);
        if(i==0){  //separa nome e RGB da cor
          var aNomeRGB=aDistintos[i][j].split(SeparadorRGBCor);
          //sValor="<span style=background-color:#"+ aNomeRGB[1] +">&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;<span>"+ aNomeRGB[0] +"</span>";
          sValor="<span style=border-style:solid;border-width:1px;border-color:#999999;background-color:#"+ aNomeRGB[1] +">&nbsp;&nbsp;&nbsp;&nbsp;</span>";
          //sValor="<span style='width:27px;background:url("+sCaminhoProds+"cores/"+aNomeRGB[0]+".gif) no-repeat;'>&nbsp;&nbsp;&nbsp;&nbsp;</span>"; //EXEMPLO DE IMAGEM PARA CADA COR
          sValor=sValor.replace("+","_");
        }
        else{sValor=aDistintos[i][j];}
        if(aDistintos[i][j]!=''){
          document.write("<span id=FC_idOpcao_"+ i +"_"+ j +"_"+ IDProduto +">");
          document.write("<li id=FC_liOpcao_"+ i +"_"+ j +"_"+ IDProduto +" style='border-style:solid;border-width:1px;border-color:white;display:inline;'><input type=radio style='display:none;' name=FC_oOpcao_"+ i +"_"+ IDProduto +" id=FC_oOpcao_"+ i +"_"+ j +"_"+ IDProduto +" value="+aDistintos[i][j]+" >"+ sValor +"");
          setTimeout("document.getElementById('FC_oOpcao_"+ i +"_"+ j +"_"+ IDProduto+"').checked=false",1);  //força desmarcar radio quando recarrega a página no IE
          if(sDisabled!="")document.getElementById("FC_oOpcao_"+ i +"_"+ j +"_"+ IDProduto).disabled=true;
          document.write("</li></span>");
        }
      }
      //if(!FC_fIsVazio(aDistintos[i]))document.write("<hr>");
    }
    document.write("</ul></div></td></tr></table>");
  }
 
  if(NivelSeguinte!=-1)document.write("");
}








/*

function FC_fInitProd(IDProduto){
//Inicializa arrays e exibe opções de IDProduto
  var FC_aProduto=new Array();
  for(var i=0;i<FC_aSubProd.length;i++)FC_aProduto=FC_aProduto.concat(FC_aSubProd[i]);
  eval("FC_aProduto_"+ IDProduto +"=FC_aProduto");

  var aDistintos=new Array();
  for(var i=0;i<FC_QtdDescritores;i++){
    var aTemp=new Array();
    FC_fDistintos(FC_aProduto,FC_posIniDescritor+i,aTemp);
    aDistintos=aDistintos.concat([aTemp]);
  }
  eval("FC_aDistintos_"+ IDProduto +"=aDistintos");
  
  var NivelSeguinte=ObtemNivelSeguinte(aDistintos,-1);  //procura pelo primeiro nível com opções
  if(NivelSeguinte==-1)return void(0); //alert('Sem opções nos sub-produtos de '+IDProduto);
  else document.write("<form name=FC_oForm_"+ IDProduto +">");

  for(var i=0;i<FC_QtdDescritores;i++){
    if(i==NivelSeguinte){FC_sClass="NivelOn";var sDisabled="";}
    else{FC_sClass="NivelOff";var sDisabled=" disabled";}
    document.write("<table><tr><td><div id=FC_idNivel_"+ i +"_"+ IDProduto +" class="+ FC_sClass +"><ul class=lstColor>");

    if(aDistintos[i].length>0){
      for(var j=0;j<aDistintos[i].length;j++){
        //alert(aDistintos[i][j]);
        if(i==0){  //separa nome e RGB da cor
          var aNomeRGB=aDistintos[i][j].split(SeparadorRGBCor);
          //sValor="<span style=background-color:#"+ aNomeRGB[1] +">&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;<span>"+ aNomeRGB[0] +"</span>";
          sValor="<span style=width:18px;background-color:#"+ aNomeRGB[1] +">&nbsp;&nbsp;&nbsp;&nbsp;</span>";
          //sValor="<span style='width:27px;background:url("+sCaminhoProds+"cores/"+aNomeRGB[0]+".gif) no-repeat;'>&nbsp;&nbsp;&nbsp;&nbsp;</span>"; //EXEMPLO DE IMAGEM PARA CADA COR
          sValor=sValor.replace("+","_");
        }
        else{sValor=aDistintos[i][j];}
        if(aDistintos[i][j]!=''){
          document.write("<span id=FC_idOpcao_"+ i +"_"+ j +"_"+ IDProduto +">");
          document.write("<li id=FC_liOpcao_"+ i +"_"+ j +"_"+ IDProduto +" style='border-style:solid;border-width:2px;border-color:white;text-align:center;'><input type=radio name=FC_oOpcao_"+ i +"_"+ IDProduto +" id=FC_oOpcao_"+ i +"_"+ j +"_"+ IDProduto +" value="+aDistintos[i][j]+" onclick='FC_fRedefineOpcoes("+ IDProduto +",FC_aProduto_"+ IDProduto +",FC_aDistintos_"+ IDProduto +","+i+",this.value);'"+ sDisabled +"><label class=FC_Opcao for=FC_oOpcao_"+ i +"_"+ j +"_"+ IDProduto +">"+ sValor +"</label>");
          setTimeout("document.getElementById('FC_oOpcao_"+ i +"_"+ j +"_"+ IDProduto+"').checked=false",1);  //força desmarcar radio quando recarrega a página no IE
          if(sDisabled!="")document.getElementById("FC_oOpcao_"+ i +"_"+ j +"_"+ IDProduto).disabled=true;
          document.write("</li></span>");
        }
      }
      //if(!FC_fIsVazio(aDistintos[i]))document.write("<hr>");
    }
    document.write("</ul></div></td></tr></table>");
  }
  document.write("<hr><table cellspacing=0 cellpadding=0><tr height=20><td id=RGBCorProduto></td><td id=CorProduto></td><td id=TamanhoProduto></td></tr></table><br><input type=button class=BotComprarGrid name=FC_oBotao_"+ IDProduto +" id=FC_oBotao_"+ IDProduto +" onClick='' value='' disabled>");
  if(NivelSeguinte!=-1)document.write("</form>");
}
*/