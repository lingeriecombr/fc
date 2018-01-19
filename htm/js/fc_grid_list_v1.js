//FastCommerce Grid [08.07.2015] v1
var zF_Grid_List = function (d) {
  "use strict";
  var options = {
    "order": ["cor", "adicional1", "adicional2", "adicional3"],
    "qtyDescriptors" : 2,
    "separadorRGBCor" : "|"
  };

  var fn = {

    eliminateDuplicates: function(arr){
      var i, len=arr.length, out=[], obj={}; for(i=0;i<len;i++){ obj[arr[i]]=0; }; for(i in obj){out.push(i);}; return out;
    },

    //retorna [] o valor de um determinado descritor, ex. tamanho [ 'P', 'M', 'G' ]
    getDescriptorValueProducts: function(obj, value){
      var results=[];
      for(var i=0; i< obj.length; i++){ var prd = obj[i]; results.push(prd[value]) ;}
      return results;
    },

    getColor: function(a){
      var name = a.slice(0,a.indexOf( options.separadorRGBCor )), rgb = a.slice(a.indexOf( options.separadorRGBCor )+1, a.length);
      return{
        name:name,
        rgb:rgb
      };
    },

    consoleLog: function(obj){
      if(typeof console !== 'undefined')console.log(obj); /* Loga informações do produto */
    },

    setListProduct: function(object){
      var out = [],
      fields = [
        ["idProduto", "id"], ["codProd", "cp"], ["cor", "cl"], ["estoque", "st"], ["adicional1", "ad1"], ["adicional2", "ad2"], ["adicional2", "ad2"], ["adicional3", "ad3"], ["imagemProdPri", "imgp"], ["imagemProdDet", "imgd"], ["imagemProdAmp", "imga"]
      ];
      for(var i=0; i < object.length; i++){
        var prdOut = {}, prdIn = object[i];
        for(var j=0; j < fields.length; j++){
          var key = fields[j][0], value = fields[j][1];
          prdOut[key] = prdIn[value];
        }
        // console.log('a', prdOut.estoque);
        if(parseInt(prdOut.estoque) > 0)out.push(prdOut);
      }
      return out;
    },

    //Define descritores existentes
    setActiveDescriptors: function(aProducts, aDescriptiors, qtyDescriptors, id){
      var out = [], idProductNotDescriptior="";
      for(var i=0; i< qtyDescriptors; i++){
        var cont=aProducts.length;
        for(var j=0; j < aProducts.length;j++){
          var oProduct = aProducts[j], sDescriptorVal = oProduct[aDescriptiors[i]];
          if(typeof sDescriptorVal === 'undefined' || sDescriptorVal===''){ cont--; idProductNotDescriptior=oProduct.id;} //tratar erro quando faltar um descritor no produto
        }
        if(cont==aProducts.length){out.push(aDescriptiors[i]);}
        else if(cont!==aProducts.length && cont>0){
          fn.consoleLogFC({'FC_Log_Grid_v1' : 'produto com descritor ausente', 'descritor' : aDescriptiors[i] + ')', 'IDProduto' : idProductNotDescriptior });
          //document.getElementById( settings.idElementGrid ).innerHTML="<span>Existe um ou mais produtos com descritores ausentes!</span>";
          return false;
        }
      }
      return out;
    }

  };

  var component = {

      contentOption: function(nameDescriptor, valueDescriptorList, nivelNow){
        var out = "", nivelNow = (typeof nivelNow !== 'undefined') ? nivelNow : '0';
        for(var i=0; i < valueDescriptorList.length; i++){
          var backgroundColor, classColor, labelDescriptor, valueDescriptor = valueDescriptorList[i];
          if(nameDescriptor.toUpperCase() == 'COR'){
            backgroundColor = '#'+fn.getColor(valueDescriptor).rgb;
            classColor = "grid-list-item-color";
            labelDescriptor = "";
          }
          else{
            backgroundColor = 'transparent';
            labelDescriptor = valueDescriptor;
            classColor = "";
          }
          out += "<li data-nivel=\""+ nivelNow +"\" class=\""+ classColor +"\">"
               +   "<span data-attr=\""+ valueDescriptor +"\" style=\"background-color:"+ backgroundColor +"\">"+ labelDescriptor +"</span>"
               + "</li>";
        }
        return "<ul class=\"content-grid-list\">"+ out +"</ul>"
      },

      //container descritores
      containerOption: function(componentChild){
        return "<div class=\"container-grid-list\">"+ componentChild +"</div>";
      }
  };

  function buildProductList(id, object){
    var out="", inHTML = d.getElementById('listGrid_'+id);
    //gerar um novo array de subprodutos
    var aProductList = fn.setListProduct(object);
    if(aProductList.length == 0) return false;
    //pega os descritores ativos nos subprodutos
    var aDescriptiors = fn.setActiveDescriptors(aProductList, options.order, options.qtyDescriptors, id);
    //loop de todos os subprodutos
    for(var i=0; i < aDescriptiors.length; i++){
      var nameDescriptor = aDescriptiors[i], nivelNow = i,
          descriptorsNow = fn.eliminateDuplicates(fn.getDescriptorValueProducts(aProductList, nameDescriptor));

      out += component.containerOption( component.contentOption(nameDescriptor, descriptorsNow, nivelNow ));
    }
    //insere as UL > LI com os descritores
    if(inHTML)inHTML.innerHTML = out;
  }

  function init(id, object){
    var id = (typeof  id !== 'undefined') ? id : null, object = (typeof object[object.length-1] !== 'undefined' ) ? object : null;
    if(id !== null && object !== null){
      //console.log('object', object[0].st);
      return buildProductList(id, object);
    }else{
      return false;
    }
  }

  return{
    init: init
  }

}(document);