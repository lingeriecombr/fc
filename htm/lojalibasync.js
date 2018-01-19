/* function : zFast @2016*/

"use strict";

var zF$ = (function () {

  var isDet = document.querySelector("body.ProductDet");
  var oProdPaiDetId;
  if (FC$.Page == "Products" && isDet) {
    oProdPaiDetId = document.querySelector(".FCGrid").id.substr(13);
  }

  function fnFormatNumber(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num)) num = "0";
    var sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    num = Math.floor(num / 100).toString();
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)num = num.substring(0, num.length - (4 * i + 3)) + '.' + num.substring(num.length - (4 * i + 3));
    return ((sign) ? '' : '-') + num;
  }

  function getProperty(props) {
    var out = {}, props = props.toString().split(';');
    for (var i = 0; i < props.length; i++) {
      var propsData = props[i].split(':'), key = (typeof propsData[0] !== 'undefined') ? propsData[0] : null,
        value = (typeof propsData[1] !== 'undefined') ? propsData[1] : null;
      if (key && value) out[key.trim()] = value.trim();
    }
    return out;
  }

  var iPL = 0;

  //return html para o price
  function fnShowPrice(data) {

    if (typeof data === 'undefined') return null;

    var out = "", interest = "", priceNormal = data.pn, priceOriginal = data.po, code = data.cp, maxParcels = parseInt(data.mp), isSub = (typeof data.issub !== 'undefined') ? JSON.parse(data.issub) : false;
    var pricemin = data.pricemin, pricemax = data.pricemax;
    // console.log('pricemin', pricemin, 'pricemax', pricemax);
    /* verifica preços diferentes entre os subprodutos */
    if (typeof pricemin !== "undefined" && typeof pricemax !== "undefined") {
      if (parseFloat(pricemin) > 0 && parseFloat(pricemax) > 0 && parseFloat(pricemin) !== parseFloat(pricemax)) {
        var priceInicial = pricemin.toString().split(".");
        if (priceInicial.length == 2) {
          var priceIntMin = priceInicial[0], priceDecimalMin = priceInicial[1];
          if (priceDecimalMin.length == 1) priceDecimalMin += "0";
        }
        else {
          var priceIntMin = priceInicial, priceDecimalMin = "00";
        }

        var priceFinal = pricemax.toString().split(".");
        if (priceFinal.length == 2) {
          var priceInt = priceFinal[0], priceDecimal = priceFinal[1];
          if (priceDecimal.length == 1) priceDecimal += "0";
        }
        else {
          var priceInt = priceFinal, priceDecimal = "00";
        }

        var text_prom = "";
        if (priceNormal != priceOriginal && priceOriginal != pricemax) { //verfica se o produto está em promoção e também se não é igual ao valor maior
          text_prom = "<div class=\"old-price\"><span><del>" + FormatPrice(priceOriginal, 'R$') + "</del></span></div>";
        }
        var txt = (isSub == false) ? '<span style="font-size:0.8em">escolha o produto para ver o preço</span>' : "";
        return '<div class="prices">'
          + text_prom
          + "<div class=\"price\"><span class=\"price-intro\"></span><span class=\"currency font-primary\">R$ </span><span class=\"int font-primary\">" + fnFormatNumber(priceIntMin) + "</span><span class=\"dec font-primary\">," + priceDecimalMin + "</span></div>"
          + "<div class=\"price\"><span class=\"price-intro\"> - </span><span class=\"currency font-primary\">R$ </span><span class=\"int font-primary\">" + fnFormatNumber(priceInt) + "</span><span class=\"dec font-primary\">," + priceDecimal + "</span></div>"
          + '</div>'
          + txt;
      }
    }

    if (priceNormal == 0 && priceOriginal == 0) {
      return "<div class=\"prices\">"
        + "  <div class=price>"
        + "    <div class='currency zf-consult-price'>"
        + "      <a href='/faleconosco.asp?idloja=" + FC$.IDLoja + "&assunto=Consulta%20sobre%20produto%20(Código%20" + code + ")' target='_top' >Preço Especial<br> Ligue e consulte!</a>"
        + "    </div>"
        + "  </div>"
        + "</div>";
    }

    var priceFinal = priceNormal.toString().split(".");
    if (priceFinal.length == 2) {
      var priceInt = priceFinal[0], priceDecimal = priceFinal[1];
      if (priceDecimal.length == 1) priceDecimal += "0";
    }
    else {
      var priceInt = priceFinal, priceDecimal = "00";
    }

    if (typeof Juros !== "undefined") {
      maxParcels = (maxParcels == 0 || maxParcels > Juros.length) ? Juros.length : maxParcels;
      interest = (Juros[maxParcels - 1] > 0) ? "" : " s/juros";
    }
    else {
      maxParcels = 0;
    }

    var text = (isSub == true) ? 'a partir de ' : (priceNormal != priceOriginal) ? '' : ''; //var text = (isSub==true) ? 'a partir de ': (priceNormal != priceOriginal)? 'de ': '';

    if (priceNormal != priceOriginal) {
      out += "<div class=\"prices\">";
      out += "  <div class=\"old-price\">" + text + " <span class=\"font-primary\">" + FormatPrice(priceOriginal, 'R$') + "</span> por </div>";
      out += "  <div class=\"price font-primary\"><span class=\"currency\">R$ </span><span class=\"int\">" + fnFormatNumber(priceInt) + "</span><span class=\"dec\">," + priceDecimal + "</span></div>";
      out += "</div>";
      if (maxParcels > 1) out += "  <div class=\"installments\">ou&nbsp;<strong><span class=\"installment-count\">" + maxParcels + "</span>x</strong> de <strong><span class=\"installment-price\">" + FormatPrecoReais(CalculaParcelaJurosCompostos(priceNormal, maxParcels)) + "</span></strong>" + interest + "</div>";
    }
    else {
      out += "<div class=\"prices\">";
      out += "<div class=\"price\"><span class=\"price-intro\">" + text + "</span><span class=\"currency font-primary\">R$ </span><span class=\"int font-primary\">" + fnFormatNumber(priceInt) + "</span><span class=\"dec font-primary\">," + priceDecimal + "</span></div>";
      out += "</div>";
      if (maxParcels > 1) out += " <div class=\"installments\">ou&nbsp;<strong><span class=\"installment-count\">" + maxParcels + "</span>x</strong> de <strong><span class=\"installment-price\">" + FormatPrecoReais(CalculaParcelaJurosCompostos(priceNormal, maxParcels)) + "</span></strong>" + interest + "</div>";
    }
    //retorna html da preço
    return out;
  }


  function fnShowPriceProdDet(data) { //Preços para detalhe do produto
    if (typeof data === 'undefined') return null;
    var out = "", interest = "", priceNormal = data.pn, priceOriginal = data.po, code = data.cp, maxParcels = parseInt(data.mp), isSub = (typeof data.issub !== 'undefined') ? JSON.parse(data.issub) : false;
        var pricemin = data.pricemin, pricemax = data.pricemax, idprod = data.idprod;
    // console.log('pricemin', pricemin, 'pricemax', pricemax);

    /* verifica preços diferentes entre os subprodutos */
    if (isDet && typeof isDet != undefined) {
      if (typeof pricemin !== "undefined" && typeof pricemax !== "undefined") {
        // console.log(parseFloat(pricemin), parseFloat(pricemax), "Funcao do detalhe");
        var oPriceDest = document.getElementById("idPriceGridFC");
        var newClass = oPriceDest.className = "newPriceMod";
        if (parseFloat(pricemin) > 0 && parseFloat(pricemax) > 0 && parseFloat(pricemin) !== parseFloat(pricemax)) {

          var priceInicial = pricemin.toString().split(".");
          if (priceInicial.length == 2) {
            var priceIntMin = priceInicial[0], priceDecimalMin = priceInicial[1];
            if (priceDecimalMin.length == 1) priceDecimalMin += "0";
          }
          else {
            var priceIntMin = priceInicial, priceDecimalMin = "00";
          }

          var priceFinal = pricemax.toString().split(".");
          if (priceFinal.length == 2) {
            var priceInt = priceFinal[0], priceDecimal = priceFinal[1];
            if (priceDecimal.length == 1) priceDecimal += "0";
          }
          else {
            var priceInt = priceFinal, priceDecimal = "00";
          }

          var text_prom = "";
          if (priceNormal != priceOriginal && priceOriginal != pricemax) { //verfica se o produto está em promoção e também se não é igual ao valor maior
            text_prom = "<div class=\"old-price\"><span><del>" + FormatPrice(priceOriginal, 'R$') + "</del></span></div>";
          }
          var txt = (isSub == false) ? '<span style="font-size:0.8em">escolha o produto para ver o preço</span>' : "";
          var output = '<div class="prices">'
            + text_prom
            + "<div class=\"price\"><span class=\"price-intro\"></span><span class=\"currency font-primary\">R$ </span><span class=\"int font-primary\">" + fnFormatNumber(priceIntMin) + "</span><span class=\"dec font-primary\">," + priceDecimalMin + "</span></div>"
            + "<div class=\"price\"><span class=\"price-intro\"> - </span><span class=\"currency font-primary\">R$ </span><span class=\"int font-primary\">" + fnFormatNumber(priceInt) + "</span><span class=\"dec font-primary\">," + priceDecimal + "</span></div>"
            + '</div>'
            + txt;
          return output;
        }
      }

      if (priceNormal == 0 && priceOriginal == 0) {
        return "<div class=\"prices\">"
          + "  <div class=price>"
          + "    <div class='currency zf-consult-price'>"
          + "      <a href='/faleconosco.asp?idloja=" + FC$.IDLoja + "&assunto=Consulta%20sobre%20produto%20(Código%20" + code + ")' target='_top' >Preço Especial<br> Ligue e consulte!</a>"
          + "    </div>"
          + "  </div>"
          + "</div>";
      }

      var priceFinal = priceNormal.toString().split(".");
      if (priceFinal.length == 2) {
        var priceInt = priceFinal[0], priceDecimal = priceFinal[1];
        if (priceDecimal.length == 1) priceDecimal += "0";
      }
      else {
        var priceInt = priceFinal, priceDecimal = "00";
      }

      if (typeof Juros !== "undefined") {
        maxParcels = (maxParcels == 0 || maxParcels > Juros.length) ? Juros.length : maxParcels;
        interest = (Juros[maxParcels - 1] > 0) ? "" : " s/juros";
      }
      else {
        maxParcels = 0;
      }

      var text = (isSub == true) ? 'a partir de ' : (priceNormal != priceOriginal) ? '' : ''; //var text = (isSub==true) ? 'a partir de ': (priceNormal != priceOriginal)? 'de ': '';

      if (priceNormal != priceOriginal) {
        out += "<div class=\"prices\">";
        out += "  <div class=\"old-price\">" + text + " <span class=\"font-primary\">" + FormatPrice(priceOriginal, 'R$') + "</span> por </div>";
        out += "  <div class=\"price font-primary\"><span class=\"currency\">R$ </span><span class=\"int\">" + fnFormatNumber(priceInt) + "</span><span class=\"dec\">," + priceDecimal + "</span></div>";
        out += "</div>";
        if (maxParcels > 1) out += "  <div class=\"installments\">ou&nbsp;<strong><span class=\"installment-count\">" + maxParcels + "</span>x</strong> de <strong><span class=\"installment-price\">" + FormatPrecoReais(CalculaParcelaJurosCompostos(priceNormal, maxParcels)) + "</span></strong>" + interest + "</div>";
      }
      else {
        out += "<div class=\"prices\">";
        out += "<div class=\"price\"><span class=\"price-intro\">" + text + "</span><span class=\"currency font-primary\">R$ </span><span class=\"int font-primary\">" + fnFormatNumber(priceInt) + "</span><span class=\"dec font-primary\">," + priceDecimal + "</span></div>";
        out += "</div>";
        if (maxParcels > 1) out += " <div class=\"installments\">ou&nbsp;<strong><span class=\"installment-count\">" + maxParcels + "</span>x</strong> de <strong><span class=\"installment-price\">" + FormatPrecoReais(CalculaParcelaJurosCompostos(priceNormal, maxParcels)) + "</span></strong>" + interest + "</div>";
      }
      //retorna html da preço
      return out;
    }
  }


  /* Price Products */
  function fnProdShowPrice(dataAttr) {
    /*
    function: exibe o valor do produto com/ sem promoção
    */
    var data = document.querySelectorAll("*[" + dataAttr + "]"); /* criar Array com todos os elementos com atributo data : dataAttr */
    if (data && typeof data === "object" && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        var sPriceProdData = data[i].getAttribute(dataAttr) != "" ? data[i].getAttribute(dataAttr) : "";
        if (sPriceProdData && sPriceProdData !== "") {
          var priceJson = getProperty(sPriceProdData); /* "pn": "0.00"; "po": "0.00"; "cp": "ref0001";"mp":"0" priceJson.pn, priceJson.po, priceJson.cp, priceJson.mp */
          data[i].removeAttribute(dataAttr); /* remove data in dom */

          if (isDet && typeof isDet != undefined) {
            data[i].insertAdjacentHTML('beforeend', fnShowPriceProdDet(priceJson)); //execute function fnShowPrice (){}
          } else {
            data[i].insertAdjacentHTML('beforeend', fnShowPrice(priceJson)); //execute function fnShowPrice (){}
          }


        }
      }
    } else {
      return null;
    }
  }

  /**/

  function fnProdShowDiscount(dataAttr) {
    /*
    function: exibe o valor desconto para pordutos em promoção
    */
    var oElementsList = document.querySelectorAll("*[" + dataAttr + "]"); /* criar Array com todos os elementos com atributo data : dataAttr */
    if (oElementsList && typeof oElementsList === "object" && oElementsList.length > 0) {
      for (var i = 0; i < oElementsList.length; i++) {
        var sProdData = oElementsList[i].getAttribute(dataAttr) != "" ? oElementsList[i].getAttribute(dataAttr) : "";
        if (sProdData && sProdData !== "") {
          var priceJson = getProperty(sProdData); /* "pn": "0.00"; "po": "0.00"; "cp": "ref0001";"mp":"0" priceJson.pn, priceJson.po, priceJson.cp, priceJson.mp */
          oElementsList[i].removeAttribute(dataAttr); /**/
          var priceOri = parseFloat(priceJson.po), priceNum = parseFloat(priceJson.pn);
          if (priceOri !== priceNum) {
            var iPercentual = fnFormatNumber(((priceOri - priceNum) / priceOri) * 100);
            var text = document.createTextNode(iPercentual + "%");  // Create a text node
            if (iPercentual >= 50) {
              var colorBackgound = 'zf-sale-gray';
            } else if (iPercentual >= 40) {
              var colorBackgound = 'zf-sale-gray';
            } else {
              var colorBackgound = 'zf-sale-gray';
            }
            oElementsList[i].appendChild(text);
            oElementsList[i].setAttribute('class', 'zf-sale-prodout ' + colorBackgound);
          }
        }
      }
    } else {
      return null;
    }
  }

  /* Name Products */
  function fnFormatNameProdZF(el, limit) {
    /*
    function : limita q quantidade de palavras de acordo com o quantidade de letras no nome do produto
    */
    var name = el.textContent.replace(/\'/g, "\'").replace(/\"/g, "\""), outWords = "", inWords = name.split(" ");
    if (typeof name !== "undefined" && inWords.length > 0) {
      for (var i = 0; i < inWords.length; i++) {
        var cont = "", cont = outWords + inWords[i];
        if (cont.length <= limit) { outWords += inWords[i] + " " } else { outWords += "..."; break }
      }
    }
    return outWords;
  }

  function fnProdName(dataAttr, limitLetter) {
    var oElementsList = document.querySelectorAll("*[" + dataAttr + "]");
    if (oElementsList && typeof oElementsList === "object" && oElementsList.length > 0) {
      for (var i = 0; i < oElementsList.length; i++) {
        var sNameProdData = typeof oElementsList[i].getAttribute(dataAttr) !== 'undefined' ? true : false;
        if (sNameProdData) {
          oElementsList[i].textContent = fnFormatNameProdZF(oElementsList[i], limitLetter);
          oElementsList[i].removeAttribute(dataAttr);
        }
      }
    } else {
      return null;
    }
  }


  function fnExecAllFuncProducts() {
    /* Pages products - exec all function products *//* centraliza as functions das páginas de produtos */
    /* name, price and sale */
    zF$.fnProdName("data-prod-name", 52);
    zF$.fnProdShowPrice("data-prod-price");
    zF$.fnProdShowDiscount("data-prod-discount");
    var eOrderList = document.getElementById("idSelectOrderZF");
    if (eOrderList) eOrderList.innerHTML = zF$.fnProdListSelectOrder();

    //show button 'mais detalhes' in mobile ande tablet
    if (zF$.detectMobileBrowsers()) {
      zF$.viewDetailsButtonMob('.zf-prodout-details');
    }

  };

  function previousDescription(id, limitLetters) {
    /* proddet : limits the size of the product description and includes the button 'Ler mais '. Anchor for the long description */
    var objectHTML = document.getElementById(id), limitLetters = (typeof limitLetters !== 'undefined') ? limitLetters : 100;
    if (objectHTML) {
      var objectText = objectHTML.textContent;
      //is description != empty
      var notEmpty = /^\s*$/.test(objectText);
      if (typeof objectText !== 'undefined' && objectText != "" && !notEmpty) {
        var substringText = objectText;
        var linkHTML = '<a href="#" class="link-description" id="linkDescription">Leia mais</a>';
        if (objectText.length > limitLetters) substringText = substringText.substring(0, limitLetters) + '...';
        objectHTML.innerHTML = substringText + " " + linkHTML;
      } else {
        objectHTML.innerHTML = '<a href="#" class="link-description" id="linkDescription">+ Mais detalhes sobre o produto</a>';
      }
      // event click button 'ler mais'
      var objectEvent = document.getElementById('linkDescription');
      if (objectEvent) {
        objectEvent.addEventListener('click', function (event) {
          event.preventDefault();
          var $ = (typeof jQuery !== 'undefined') ? jQuery : null;
          if ($) {
            var body = $("html, body"), scrollTopValue = 500;
            body.stop().animate({ scrollTop: scrollTopValue }, '500', 'swing', function () {
              console.log("Finished animating scroll");
            });
          } else {
            var body = document.body; // For Chrome, Safari and Opera
            var html = document.documentElement; // Firefox and IE places the overflow at the <html> level, unless else is specified. Therefore, we use the documentElement property for these two browsers
            body.scrollTop = 300;
            html.scrollTop = 300;
          }
        });
      }
    } else {
      return null;
    }
  }


  function addUnitQtyProdCart(elem, number) {
    /* add or diminish the amount quantyty in cart page */
    var idElem = elem.getAttribute("data-qty-id"), elemQty = document.querySelector("#" + idElem);
    if (elemQty && typeof number === 'number') {
      var qtyNow = (elemQty.value == "") ? 0 : parseInt(elemQty.value);
      var newValue = parseInt(qtyNow) + (number);
      if (newValue > 0 && newValue < 1000) {

        elemQty.value = newValue;
        FCLib$.MirrorCartQty(elemQty);
        /*elemQty.style.cssText = "background: #ff4a4a; box-shadow: inset 0px 2px 8px #990000; color: #ffffff;";*/
        var isAlert = document.querySelector('.alert-updade-cart'), iSetTime = 10000;
        if (!isAlert) {
          var elemHTML = document.createElement('div');
          elemHTML.setAttribute('class', 'alert-updade-cart');
          elemHTML.innerHTML = 'Clique para <button id="FCCartRecalculateBut" type="submit" onclick="document.Lista.Buy.value=\'\';">Atualizar</button>';
          elem.parentNode.insertBefore(elemHTML, elem.nextSibling);
          setTimeout(function () { elemHTML.style.display = 'none'; }, iSetTime);
        } else {
          isAlert.style.display = 'block';
          elem.parentNode.insertBefore(isAlert, elem.nextSibling);
          setTimeout(function () { isAlert.style.display = 'none'; }, iSetTime);
        }
      }
    } else {
      console.log("addUnitQtyProdCart: object HTML undefined or parameter 'number' is not type number");
    }
  }

  function addInputQtyProdCart(selector) {
    /* add button for add or decrease quantity in cart page*/
    var aInputQtyProducts = document.querySelectorAll(selector);
    if (aInputQtyProducts && aInputQtyProducts.length > 0) {
      for (var i = 0; i < aInputQtyProducts.length; i++) {
        var oInputQty = aInputQtyProducts[i], idElem = oInputQty.id;
        if (typeof idElem !== 'undefined') {
          //create and add button decrease '-'
          var btnDecrease = document.createElement('span');
          btnDecrease.textContent = '-';
          btnDecrease.setAttribute('class', 'btn-qty-add btn-qty-decrease');
          btnDecrease.setAttribute('data-qty-id', idElem);
          btnDecrease.onclick = function () {
            zF$.addUnitQtyProdCart(this, -1);
          };
          //create and add button plus '+'
          var btnPlus = document.createElement('span');
          btnPlus.textContent = '+';
          btnPlus.setAttribute('class', 'btn-qty-add btn-qty-plus');
          btnPlus.setAttribute('data-qty-id', idElem);
          btnPlus.onclick = function () {
            zF$.addUnitQtyProdCart(this, 1);
          };
          oInputQty.parentNode.insertBefore(btnDecrease, oInputQty);
          oInputQty.parentNode.insertBefore(btnPlus, oInputQty.nextSibling);
        } else {
          console.log('addInputQtyProdCart: attribute id in object HTML undefined');
        }
      }
    } else {
      console.log('addInputQtyProdCart: fields inputs quantity undefined');
    }
  }

  function formatterNameCrossSelling(objectHTML, limitLetter) {
    var limitLetter = (typeof limitLetter !== 'undefined') ? limitLetter : 50;
    var objectHTML = objectHTML;
    var objectCodeReference = objectHTML.querySelector('.EstRefProdCross');
    var objectNotElement = objectHTML.removeChild(objectCodeReference);
    var objectText = objectHTML.textContent;
    var textSubstring = '';
    if (objectText.length >= limitLetter) {
      textSubstring = objectText.substring(0, limitLetter) + '... ';
    } else {
      textSubstring = objectText;
    }
    objectHTML.innerHTML = textSubstring;
    objectHTML.appendChild(objectCodeReference);
  }


  function fnUpdateCart(IsAdd, IsSpy) {
    return FCLib$.fnAjaxExecFC("/XMLCart.asp", "IDLoja=" + FC$.IDLoja, false, fnCallbackUpdateCart, IsAdd, IsSpy);
  }

  function fnCallbackUpdateCart(oHTTP, IsAdd, IsSpy) {
    /**/
    if (oHTTP.responseXML) {
      var oXML = oHTTP.responseXML, oCarts = oXML.getElementsByTagName("cart");
      try { var currencyProdCart = (oCarts[0].getElementsByTagName("currency")[0].childNodes[0].nodeValue); } catch (e) { currencyProdCart = FC$.Currency }
      try { var TotalQtyProdCart = (oCarts[0].getElementsByTagName("TotalQty")[0].childNodes[0].nodeValue); } catch (e) { TotalQtyProdCart = "0" }
      try { var subtotalProdCart = (oCarts[0].getElementsByTagName("subtotal")[0].childNodes[0].nodeValue); } catch (e) { subtotalProdCart = "0,00" }

      var itemText = (parseInt(TotalQtyProdCart) > 1) ? "itens" : "item",
        htmlOut = "<a href=\"/AddProduto.asp?IDLoja=" + FC$.IDLoja + "\" title=\"Ir para o carrinho\">" + TotalQtyProdCart + " " + itemText + " | " + currencyProdCart + " " + subtotalProdCart + "</a>";
      if (IsSpy) {
        var oReferrer = window.parent, oTarget = oReferrer.document.getElementById("headerCartLabel");
        if (oTarget) oTarget.innerHTML = htmlOut;
      }
      else {
        var oTarget = document.getElementById("headerCartLabel");
        if (oTarget) oTarget.innerHTML = htmlOut;
      }
    }
  }

  //Ordenação
  function fnProdListSelectOrder() {
    // var selectTypeProd, aList = ["Ordenar por", "Padrão", "Lançamentos", "Destaques", "Nomes das categorias", "Nomes dos produtos", "Avaliações dos clientes", "Promoções", "Preços menores", "Preços maiores"];
    var aList = [["Ordenar por", -1], ["Padrão", 0], ["Nome do Produto", 4], ["Preço maior", 8], ["Preço menor", 7]];
    var selectTypeProd = "<select id='OrderProd' onchange='zF$.fnProdListNewOrder(this.value)'>";

    var sPag = document.location.href.toUpperCase(), iOrderParam = sPag.slice((sPag.indexOf("ORDER") + 6), (sPag.indexOf("ORDER") + 7)),
      selected_option = !isNaN(parseInt(iOrderParam)) ? parseInt(iOrderParam) : -999;
    for (var i = 0; i < aList.length; i++) {
      // var isSelected = ((i-1) == selected_option) ? "selected" : "";
      // selectTypeProd += "<option value="+ (i-1) +" "+ isSelected +">"+ aList[i] +"</option>";
      var isSelected = (aList[i][1] == selected_option) ? "selected" : "";
      selectTypeProd += "<option value=" + aList[i][1] + " " + isSelected + ">" + aList[i][0] + "</option>";
    }
    selectTypeProd += "</select>";
    return selectTypeProd;
  }

  function fnProdListNewOrder(iOrder) {
    //Ordenação
    var sPag = document.location.href.toUpperCase(), sConcat, sCharSep;
    if (sPag.indexOf("/PROD,") == -1) { sConcat = "&"; sCharSep = "="; } else { sConcat = ","; sCharSep = ","; }
    var oOrder = document.getElementById('OrderProd');
    var posOrder = sPag.indexOf("ORDER" + sCharSep);
    if (posOrder != -1) {
      var iOrderCurrent = sPag.substr(posOrder + 6, 1);
      if (!isNaN(iOrderCurrent)) if (iOrderCurrent >= 0) {
        var i = 0;
        while (i < oOrder.length && oOrder.options[i].value != iOrderCurrent) i++;
        if (i < oOrder.length) oOrder.selectedIndex = i;
      }
    }
    var iOrder = iOrder;
    if (iOrder >= 0) {
      if (posOrder != -1) { //encontrou order, substitui
        var sLoc = document.location.href.replace(new RegExp('order' + sCharSep + iOrderCurrent), 'order' + sCharSep + iOrder);
      }
      else { //se não encontrar
        if (sPag.indexOf("IDLOJA") > 0) {  //insere via subst idloja com order depois
          var sLoc = document.location.href.replace(new RegExp('idloja' + sCharSep + FC$.IDLoja, 'gi'), 'idloja' + sCharSep + FC$.IDLoja + sConcat + 'order' + sCharSep + iOrder);
        }
        else { //não tem idloja
          if (sPag.indexOf("?") > 0) {  //insere via subst idloja com order depois
            var sLoc = document.location.href + sConcat + 'order' + sCharSep + iOrder;
          }
          else {
            var sLoc = document.location.href + '?order=' + iOrder;
          }
        }
      }
      document.location.href = sLoc;
    }
  }

  function viewDetailsButtonMob(args) {
    var objectDOM = document.querySelectorAll(args);
    for (var i = 0; i < objectDOM.length; i++) {
      //objectDOM[i].setAttribute('class', '');
      objectDOM[i].setAttribute('class', objectDOM[i].getAttribute('class') + ' zf-prodout-details-mob');
    }
  }

  function detectMobileBrowsers() {
    /*
     * By Chad Smith, https://twitter.com/chadsmith
     * source: http://detectmobilebrowser.com/mobile
     * Regex updated: 1 August 2014
     * Detect mobile and tablet (android|bb\d+|meego|ipad|playbook|silk)
     */
    var a = navigator.userAgent || navigator.vendor || window.opera;
    if (/(android|bb\d+|meego|ipad|playbook|silk).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
      // alert('is Mobile browser');
      return true;
    } else {
      // alert('Not is Mobile browser');
      return false;
    }
  }
  function fnChangeInnerText(elem, text) {
    var elem = document.querySelector(elem);
    if (elem) elem.textContent = text;
  }

  function addFieldsFormSearchCustom(selectorInputs) {

    var contentFieldsForm = document.querySelector(selectorInputs);

    if (contentFieldsForm) {
      var inputs = contentFieldsForm.querySelectorAll('input[type="hidden"]'),
        formSelector = contentFieldsForm.getAttribute('data-custom-form'),
        formElement = document.querySelector(formSelector);

      if (formElement) {
        for (var i = 0; i < inputs.length; i++) {
          formElement.appendChild(inputs[i]);
        }
      }
    }
  }


  function fnLoginClient(dataAttr) {
    /*
    function : login/ logout
    */
    var loginContainer = document.querySelectorAll(".zFContactLogin");
    var nameAll = document.querySelectorAll("*[" + dataAttr + "]");
    if (nameAll.length > 0) {
      for (var i = 0; i < nameAll.length; i++) {
        var nameAllAttr = nameAll[i].getAttribute(dataAttr);
        var idWordSpace = nameAllAttr.indexOf(' ');//Para cortar o resto do nome a partir do espaço
        if (nameAllAttr !== "") {
          if (idWordSpace > 0) {
            console.log("aaaa");
            nameAll[i].innerHTML = "Olá <b>" + nameAllAttr.substring(0, idWordSpace) + ",</b> <a href=\"#\" onclick=\"FCLib$.fnClientLogout('account')\">sair</a>";
          }
          else { nameAll[i].innerHTML = "Olá <b>" + nameAllAttr + ",</b> <a href=\"#\" onclick=\"FCLib$.fnClientLogout('account')\">sair</a>"; }
        }
      }
    } else {
      return false;
    }
  }

  /* exports */
  return {
    fnFormatNumber: fnFormatNumber,
    fnProdShowPrice: fnProdShowPrice,
    fnShowPriceProdDet: fnShowPriceProdDet,
    fnShowPrice: fnShowPrice,
    fnProdShowDiscount: fnProdShowDiscount,
    fnFormatNameProdZF: fnFormatNameProdZF,
    fnProdName: fnProdName,
    previousDescription: previousDescription,
    addUnitQtyProdCart: addUnitQtyProdCart,
    addInputQtyProdCart: addInputQtyProdCart,
    formatterNameCrossSelling: formatterNameCrossSelling,
    fnExecAllFuncProducts: fnExecAllFuncProducts,
    fnUpdateCart: fnUpdateCart,
    fnProdListSelectOrder: fnProdListSelectOrder,
    fnProdListNewOrder: fnProdListNewOrder,
    viewDetailsButtonMob: viewDetailsButtonMob,
    detectMobileBrowsers: detectMobileBrowsers,
    fnChangeInnerText: fnChangeInnerText,
    fnLoginClient: fnLoginClient,
    addFieldsFormSearchCustom: addFieldsFormSearchCustom
  }
})();

(function () {

  //define class responsive for #idFCContent
  var getBodyClass = document.body.getAttribute('class');
  if (getBodyClass === "FCProduct ProductList" || getBodyClass === "FCNewsletter" || getBodyClass === "FCAdvancedSearch" || getBodyClass === "FCCategories") {
    var domColumn = document.getElementById('idFCContent');
    if (domColumn) domColumn.setAttribute('class', 'col-sm-8 col-md-9 col-lg-9');
  }
  else if (getBodyClass === "FCProduct ProductDet" || getBodyClass === "FCHelp") {
    var domColumn = document.getElementById('idFCContent');
    if (domColumn) domColumn.setAttribute('class', 'col-xs-12 col-sm-12 col-md-12 col-lg-12');
  }
  zF$.fnLoginClient("data-login-name-client");
  zF$.fnProdName("data-prod-name", 52);
  zF$.fnProdShowPrice("data-prod-price");
  zF$.fnProdShowDiscount("data-prod-discount");
  zF$.fnUpdateCart(true, false);

  //show button 'mais detalhes' in mobile ande tablet
  if (zF$.detectMobileBrowsers()) {
    zF$.viewDetailsButtonMob('.zf-prodout-details');
  }

  if (FC$.Page == "Products") {
    //zF$.previousDescription("previousDescription", 120);
    zF$.fnExecAllFuncProducts();
  }

  if (FC$.Page == "Cart") {
    zF$.addInputQtyProdCart(".FCCartQtyInput");
  }

  if (FC$.Page == "Products") {
    // formatter length name products cross-selling
    var aNameCrossSelling = document.querySelectorAll('#idListProdCrossFC .EstNameProdCross a');
    if (aNameCrossSelling && aNameCrossSelling.length > 0) {
      for (var i = 0; i < aNameCrossSelling.length; i++) {
        zF$.formatterNameCrossSelling(aNameCrossSelling[i], 45);
      }
    }
  }

  if (FC$.Page == "Cart") {
    zF$.fnChangeInnerText("#FCCartFreightSimulationBut", "Calcular frete");
    zF$.fnChangeInnerText("#FCCartRecalculateBut", "Atualizar");
    zF$.fnChangeInnerText("#idTxtRecalculateFC b", "Atualizar");
    //zF$.fnChangeInnerText("#FCCartStillShoppingBut","Continuar Compras");
    //zF$.fnChangeInnerText("#FCCartBuyBut","Finalizar");
  }
  else if (FC$.Page == "AdvancedSearch") {
    zF$.fnChangeInnerText(".Titulos", "Busca Avançada");
  }

  //custom 
  if (FC$.Page == "Custom") {
    zF$.addFieldsFormSearchCustom('#contentFieldsForm');
  }

})();

//Efeito Slide menu barra esquerda

jQuery(document).ready(function ($) {
  var allItens = $('.zFLeftBar .Cat1FC').hide();
  // var CatFather = $('.zFLeftBar .Cat0FC').append("<span class='zFArrowCat'></span>");
  $('.zFLeftBar .Cat0FC').click(function () {
    allItens.slideUp();
    if ($(this).parent().find(".Cat1FC").css('display') == 'none') {
      $(this).parent().find(".Cat1FC").show(200);
      $(this).addClass('arrow-cat-open');
    } else {
      $(this).parent().find(".Cat1FC").hide(200);
      $(this).removeClass('arrow-cat-open');
    }
    return false;
  });

  //nassra topp
  //define posicionamento mega-menu : BarraTopo.htm, BarraTopoCustom.htm e custom*.htm
  $('.zf-header-menu li div.zf-header-megamenu').each(function () {

    var content = jQuery(this), container = $('.zf-header-menu'), pos1 = parseInt($(container).width() + $(container).offset().left, 10),
      pos2 = parseInt($(content).width() + $(content).offset().left, 10);
    if (pos1 < pos2) {
      $(content).css({ 'margin-left': parseInt(pos1 - pos2) + 'px' });
    }
  })
});

// Grade de produtos

/*Função para mostrar parcelamento*/
function fnMaxInstallmentsGrid(Price, iMaxParcels) {
  var ComSem;
  if (Price >= 100) iMaxParcels = 4;
  else if (Price >= 75) iMaxParcels = 3;
  else if (Price >= 50) iMaxParcels = 2;
  else if (Price >= 1) iMaxParcels = 1;
  if (typeof Juros != "undefined") {
    if (Price == 0 || iMaxParcels == 1 || Juros.length == 0) return "";
    if (iMaxParcels == 0 || iMaxParcels > Juros.length) iMaxParcels = Juros.length;
    if (Juros[iMaxParcels - 1] > 0) { var sInterest = ""; } else { var sInterest = "sem juros"; }
    return "<div class=FCInstallment><span class=FCInstallmentCount>" + iMaxParcels + "x</span> de <span class=FCInstallmentValue>" + FormatPrecoReais(CalculaParcelaJurosCompostos(Price, iMaxParcels)) + "</span> " + sInterest + "</div>";
  } else {
    return "";
  }
}

/*Função para mostrar valor formatado*/
function FormatNumber(num) {
  var num = num.toString().replace(/\$|\,/g, '');
  if (isNaN(num)) num = "0";
  sign = (num == (num = Math.abs(num))); num = Math.floor(num * 100 + 0.50000000001); num = Math.floor(num / 100).toString();
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)num = num.substring(0, num.length - (4 * i + 3)) + '.' + num.substring(num.length - (4 * i + 3));
  return ((sign) ? '' : '-') + num;
}

/*Função para mostrar valor economizado em produtos em promoção*/
function fnShowEconomyGrid(ProdPrice, ProdPriceOri) {
  if (ProdPrice != ProdPriceOri && typeof FormatNumber == 'function' && typeof FormatPrice == 'function') {
    return "<span class='FCGridEconomy'>Economize <b>" + FormatPrice(ProdPriceOri - ProdPrice, 'R$') + "</b> (" + FormatNumber(((ProdPriceOri - ProdPrice) / ProdPriceOri) * 100) + "%)</span>";
  } else { return ""; }
}

//Funções para o carrinho
var oDivShowCartOnPage = null;
var iLastCartOnPage = 0;

function ShowCartOnPage(IDLoja, iErr, sMsg, sCartText, sCheckoutText, este) {

  var oPos = getPos(este);
  if (oDivShowCartOnPage == null) {
    var oNewElement = document.createElement("div");
    oNewElement.setAttribute("id", "DivShowCartOnPage");
    oNewElement.setAttribute("class", "show-cartonpage-container");
    oDivShowCartOnPage = document.body.appendChild(oNewElement);
  }

  oDivShowCartOnPage.style.marginTop = "-95px";
  oDivShowCartOnPage.style.marginLeft = "-50px";
  oDivShowCartOnPage.style.position = "absolute";
  oDivShowCartOnPage.style.zIndex = "1";
  var iW = 238;
  var iH = 100;
  var oPosPrice = document.getElementById('PosPrice');
  if (oPosPrice) {
    iW = oPosPrice.offsetWidth;
    iH = oPosPrice.offsetHeight;
  }
  if (iErr == 0) { var sBackColor = "3187e6"; var iLH = 45 } else { var sBackColor = "949494"; var iLH = 25 }
  var sHTML = "<div>";

  if (iErr == 0) {
    sHTML += "<p class='show-cartonpage-msg show-cartonpage-succes'>" + sMsg + "<span onclick='document.getElementById(\"DivShowCartOnPage\").style.visibility=\"hidden\"'></span></p>"
    sHTML += "<div class='show-cartonpage-Button'>";
    sHTML += "<span class='cartonpage-btn-continue' onclick='javascript:history.go(0)'>Continuar comprando</span>";
    sHTML += "<a class='cartonpage-btn-buy' href=\"javascript:window.parent.location.href='addproduto.asp?idloja=" + IDLoja + "'\"'>Finalizar Pedido</a>";
    sHTML += "</div>"
    zF$.fnUpdateCart(true, false);
  }
  else {
    sHTML += "<p class='show-cartonpage-msg show-cartonpage-error'>" + sMsg + "<span onclick='document.getElementById(\"DivShowCartOnPage\").style.visibility=\"hidden\"'></span></p>";
  }
  sHTML += "</div";

  oDivShowCartOnPage.style.top = oPos.y + "px";
  oDivShowCartOnPage.style.left = oPos.x + "px";
  oDivShowCartOnPage.innerHTML = sHTML;
  oDivShowCartOnPage.style.visibility = "visible";
  iLastCartOnPage++;
  setTimeout("if(iLastCartOnPage==" + iLastCartOnPage + ")oDivShowCartOnPage.style.visibility='hidden';", 4000);
}

/* toolbar float */
jQuery(window).scroll(function (event) {
  var iWidthWindow = jQuery(window).width(), scroll = jQuery(window).scrollTop();
  if (scroll > 30 && iWidthWindow >= 1000 && FC$.Page != "Cart") {
    jQuery('.zf-toolbar-container').addClass('zf-fixBar');
  }
  else { jQuery('.zf-toolbar-container').removeClass('zf-fixBar'); }
});

/* menu mobile event click*/
(function () {
  var h = document.getElementById('menu-hamburger-ico');
  h.addEventListener('click', function (event) {
    event.preventDefault();
    this.classList.toggle("mobile-menu--active");
  }, false);

  var w = window.innerWidth;
  var h = window.innerHeight;
  if (w <= 767) {
    var m = document.querySelectorAll('.zf-header-menu > li');
    for (var l = 0; l < m.length; l++) {
      var oldElem = m[l].querySelector("a");
      var attrNotDisableLink = oldElem.getAttribute("class");
      console.log(typeof attrNotDisableLink);
      if (typeof attrNotDisableLink === "object") {
        var newElem = oldElem.insertAdjacentHTML('afterend', "<p>" + oldElem.textContent + "</p>");
        oldElem.style.cssText = "display:none";
        var newElemtoClick = m[l].querySelector("p");
        newElemtoClick.addEventListener('click', function (event) {
          event.preventDefault();
          this.classList.toggle("show");
          // var allElemtsP = document.querySelectorAll(".zf-header-menu > li > p");
          // for (var r = 0; r < allElemtsP.length; r++) {
          //   if (allElemtsP[r].classList.value > 1){
          //     allElemtsP[r].classList.remove("show");
          //     console.log("este tem class", allElemtsP[r].classList.value);
          //   }
        }, false);
      }
    }
    console.log(w, h);
  }
})();

    // var obj = function(){
    //   var linkElem = document.querySelectorAll(".menu-container-mob > ul > li > a");
    //   for(var k = 0; k<linkElem.length;k++){
    //     if (typeof linkElem[k].href != "undefined" && linkElem[k].href !== ""){
    //       linkElem[k].setAttribute("data-href",linkElem[k].href);
    //       linkElem[k].removeAttribute("href");
    //     }
    //     else if(typeof linkElem[k].getAttribute("data-href") != "undefined" && linkElem[k].getAttribute("data-href") !== ""){
    //       linkElem[k].setAttribute("href",linkElem[k].getAttribute("data-href"));
    //       linkElem[k].removeAttribute("data-href");
    //     }
    //   }
    // }

    // h.addEventListener('click',function(event){
    //   event.preventDefault();
    //   var state = this.getAttribute('data-state');
    //   if(state === "disable"){
    //     this.setAttribute("data-state","enable");
    //     this.classList.add('mobile-menu--active');
    //     obj();
    //   }
    //   else{
    //     this.classList.remove('mobile-menu--active');
    //     this.setAttribute ("data-state","disable");
    //     obj();
    //   }

