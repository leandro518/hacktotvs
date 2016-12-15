#INCLUDE "TOTVS.CH"
#INCLUDE "RESTFUL.CH"

WSRESTFUL sales DESCRIPTION "Vendas" 

	WSDATA id AS INTEGER
	WSDATA start AS INTEGER
	WSDATA limit AS INTEGER
	WSDATA estado AS STRING
	WSDATA vend AS INTEGER
	
	WSMETHOD GET DESCRIPTION "Busca total" PATH "{id}" PRODUCES APPLICATION_JSON 
	WSMETHOD GET getAll DESCRIPTION "get" PATH "vend/{vend}" PRODUCES APPLICATION_JSON
	WSMETHOD GET getmeta DESCRIPTION "get" PATH "meta/{vend}" PRODUCES APPLICATION_JSON 
	WSMETHOD GET getrank DESCRIPTION "get" PATH "rank/{vend}" PRODUCES APPLICATION_JSON
	WSMETHOD GET getmsg DESCRIPTION "get" PATH "msg/{vend}" PRODUCES APPLICATION_JSON

END WSRESTFUL

WSMETHOD GET PATHPARAM id QUERYPARAM start, limit WSREST sales

Local cAlias := GetNextAlias()
Local cQuery
Local oResponse := JsonObject():New()
Local nLength := 0
Local nTotReg := 0
Local cDtIni  := AllTrim(STR(year(Date())))+AllTrim(STR(month(Date())))+"01"
Local cDtFim  := AllTrim(STR(year(Date())))+AllTrim(STR(month(Date())))+"31" 
Local cWhere := " WHERE L1_FILIAL = '"+xFilial('SL1')+"' AND L1_EMISNF >= '"+cDtIni+"' AND L1_EMISNF <= '"+cDtFim+"'"
DEFAULT ::start := 1, ::limit := oResponse['length']
DEFAULT ::id := 1

cWhere +=" AND L1_VEND= '"+StrZero(::id, 6)+"' AND D_E_L_E_T_ = '' "		// adiciona o vendedor

cQuery := "SELECT COUNT(L1_NUM) AS NCOUNT FROM "+ RetSqlName('SL1') +cWhere
DbUseArea( .T., "TOPCONN", TCGenQry(,,cQuery), cAlias, .F., .F. )
nTotReg := oResponse['length'] := (cAlias)->NCOUNT
DbCloseArea()

cQuery := "SELECT L1_EMISNF,L1_HORA,L1_VLRTOT,L1_COMIS FROM " + RetSqlName('SL1') + cWhere+" ORDER BY L1_EMISNF+L1_HORA DESC"
DbUseArea( .T., "TOPCONN", TCGenQry(,,cQuery), cAlias, .F., .F. )

varinfo("QUERY ",cQuery)

If ::start > 1
	DbSkip(::start)
EndIf
oResponse['dados'] := {}

While (cAlias)->(!Eof()) .and. ++nLength <= nTotReg
	Aadd(oResponse['dados'], JsonObject():New())
	oResponse['dados'][nLength]['data'] 	:= SubStr((cAlias)->L1_EMISNF,7,2)+"/"+SubStr((cAlias)->L1_EMISNF,5,2)
	oResponse['dados'][nLength]['hora'] 	:= SubStr((cAlias)->L1_HORA,1,5)
	oResponse['dados'][nLength]['valor']	:= (cAlias)->L1_VLRTOT
	oResponse['dados'][nLength]['comis']	:= (cAlias)->L1_COMIS
	
	DbSkip()
End
DbCloseArea()

::SetResponse(FWJsonSerialize(oResponse, .F., .F., .T.))
Return .T.

WSMETHOD GET getAll PATHPARAM vend WSREST sales
Local cAlias := GetNextAlias()
Local cQuery
Local oResponse 	:= JsonObject():New()
Local nLength 		:= 0
Local cVendName		:= "VENDEDOR NAO ENCONTRADO"
Local cDtIni  		:= AllTrim(STR(year(Date())))+AllTrim(STR(month(Date())))+"01"
Local cDtFim  		:= AllTrim(STR(year(Date())))+AllTrim(STR(month(Date())))+"31"
Local cFromWhere 	:= " FROM " + RetSqlName('SL1') + " WHERE L1_FILIAL = '" + xFilial('SL1') 
Local nTotReg		:= 0
Local cWhere := " WHERE L1_FILIAL = '"+xFilial('SL1')+"' AND L1_EMISNF >= '"+cDtIni+"' AND L1_EMISNF <= '"+cDtFim+"'"

DEFAULT ::vend := 1

cFromWhere +="' AND L1_VEND= '"+StrZero(::vend, 6)+"' AND D_E_L_E_T_ = '' "		// adiciona o vendedor
// Busca a quantidade de vendas
cQuery := "SELECT COUNT(*) AS NCOUNT " + cFromWhere 
DbUseArea( .T., "TOPCONN", TCGenQry(,,cQuery), cAlias, .F., .F. )
oResponse['length'] := (cAlias)->NCOUNT
DbCloseArea()
// Busca o total de vendas e comissao no mes
cQuery := "SELECT SUM(L1_VLRTOT) AS MESVEN , SUM(L1_COMIS) AS MESCOM" + cFromWhere 
cQuery += " AND L1_EMISNF >= '"+cDtIni+"' AND L1_EMISNF <= '"+cDtFim+"'"		// adiciona do mês
DbUseArea( .T., "TOPCONN", TCGenQry(,,cQuery), cAlias, .F., .F. )
oResponse['tot_vmes'] 	:= (cAlias)->MESVEN
oResponse['tot_cmes'] 	:= (cAlias)->MESCOM
DbCloseArea()

// Busca o total de vendas e comissao no dia
cQuery := "SELECT SUM(L1_VLRTOT) AS TOTAL , SUM(L1_COMIS) AS COMIS" + cFromWhere
cQuery += " AND L1_EMISNF = '"+DTOS(Date())+"'"									// adiciona do dia 
DbUseArea( .T., "TOPCONN", TCGenQry(,,cQuery), cAlias, .F., .F. )

if oResponse['length']  > 0 
	cVendName := GetVendName(StrZero(::vend, 6))
EndIf
oResponse['messages'] := []
oResponse['name'] 		:= SubStr(cVendName,0,15)
oResponse['tot_venda'] 	:= (cAlias)->TOTAL
oResponse['tot_comis'] 	:= (cAlias)->COMIS
DbCloseArea()

cQuery := "SELECT SUM(L1_VLRTOT) AS MESVEN,L1_VEND FROM " + RetSqlName('SL1') + cWhere+" GROUP BY L1_VEND ORDER BY MESVEN DESC"
DbUseArea( .T., "TOPCONN", TCGenQry(,,cQuery), cAlias, .F., .F. )

varinfo("QUERY 3",cQuery)

While (cAlias)->(!Eof())
	nTotReg++
	If (cAlias)->L1_VEND == StrZero(::vend, 6)
		Exit
	EndIf
	DbSkip()
End
oResponse['pos_rank'] 	:=  nTotReg

DbCloseArea()
::SetResponse(FWJsonSerialize(oResponse, .F., .F., .T.))
Return .T.

WSMETHOD GET getmeta PATHPARAM vend WSREST sales
Local cAlias := GetNextAlias()
Local cQuery
Local oResponse 	:= JsonObject():New()
Local nLength 		:= 0
Local cVendName		:= "VENDEDOR NAO ENCONTRADO"
Local cDtIni  		:= AllTrim(STR(year(Date())))+AllTrim(STR(month(Date())))+"01"
Local cDtFim  		:= AllTrim(STR(year(Date())))+AllTrim(STR(month(Date())))+"31"
Local cFromWhere 	:= " FROM " + RetSqlName('SL1') + " WHERE L1_FILIAL = '" + xFilial('SL1') 

DEFAULT ::vend := 1

cFromWhere +="' AND L1_VEND= '"+StrZero(::vend, 6)+"' AND D_E_L_E_T_ = '' "		// adiciona o vendedor

// Busca o total de vendas e comissao no mes
cQuery := "SELECT SUM(L1_VLRTOT) AS MESVEN , SUM(L1_COMIS) AS MESCOM" + cFromWhere 
cQuery += " AND L1_EMISNF >= '"+cDtIni+"' AND L1_EMISNF <= '"+cDtFim+"'"		// adiciona do mês
DbUseArea( .T., "TOPCONN", TCGenQry(,,cQuery), cAlias, .F., .F. )
oResponse['vend_mes'] 	:= (cAlias)->MESVEN
DbCloseArea()

// Busca o total de vendas e comissao no dia
cQuery := "SELECT SUM(L1_VLRTOT) AS TOTAL , SUM(L1_COMIS) AS COMIS" + cFromWhere
cQuery += " AND L1_EMISNF = '"+DTOS(Date())+"'"									// adiciona do dia 
DbUseArea( .T., "TOPCONN", TCGenQry(,,cQuery), cAlias, .F., .F. )
oResponse['vend_dia'] 	:= (cAlias)->TOTAL
DbCloseArea()

// Busca o total de vendas e comissao no dia
cQuery := "SELECT A3_METAM,A3_METAD FROM "+RetSqlName('SA3')+" WHERE A3_COD="+StrZero(::vend, 6) 
DbUseArea( .T., "TOPCONN", TCGenQry(,,cQuery), cAlias, .F., .F. )
oResponse['meta_dia'] 	:= (cAlias)->A3_METAD
oResponse['meta_mes'] 	:= (cAlias)->A3_METAM
DbCloseArea()

::SetResponse(FWJsonSerialize(oResponse, .F., .F., .T.))
Return .T.

WSMETHOD GET getrank PATHPARAM vend WSREST sales
Local cAlias := GetNextAlias()
Local cQuery
Local oResponse := JsonObject():New()
Local nLength := 0
Local nTotReg := 0
Local cDtIni  := AllTrim(STR(year(Date())))+AllTrim(STR(month(Date())))+"01"
Local cDtFim  := AllTrim(STR(year(Date())))+AllTrim(STR(month(Date())))+"31" 
Local cWhere := " WHERE L1_FILIAL = '"+xFilial('SL1')+"' AND L1_EMISNF >= '"+cDtIni+"' AND L1_EMISNF <= '"+cDtFim+"'"

cQuery := "SELECT SUM(L1_VLRTOT) AS MESVEN,L1_VEND FROM " + RetSqlName('SL1') + cWhere+" GROUP BY L1_VEND  ORDER BY MESVEN DESC"
DbUseArea( .T., "TOPCONN", TCGenQry(,,cQuery), cAlias, .F., .F. )

varinfo("QUERY 2",cQuery)

While (cAlias)->(!Eof())
	nTotReg++
	DbSkip()
End
(cAlias)->(dbgoTop())
oResponse['dados'] := {}
While (cAlias)->(!Eof()) .and. ++nLength <= nTotReg
	Aadd(oResponse['dados'], JsonObject():New())
	oResponse['dados'][nLength]['pos'] 		:= nLength
	oResponse['dados'][nLength]['nome'] 	:= SubStr(GetVendName((cAlias)->L1_VEND),1,15)
	oResponse['dados'][nLength]['comis']	:= (cAlias)->MESVEN
	DbSkip()
End
DbCloseArea()

::SetResponse(FWJsonSerialize(oResponse, .F., .F., .T.))
Return .T.

WSMETHOD GET getmsg PATHPARAM vend WSREST sales
Local cAlias := GetNextAlias()
Local cQuery
Local oResponse := JsonObject():New()
Local nLength := 0
Local nTotReg := 0

cQuery := "SELECT MSG_DATA,MSG_REMET,MSG_MSG FROM " + RetSqlName('MSG_MSG')
DbUseArea( .T., "TOPCONN", TCGenQry(,,cQuery), cAlias, .F., .F. )

varinfo("QUERY 4",cQuery)

oResponse['dados'] := {}
While (cAlias)->(!Eof())
	++nLength
	Aadd(oResponse['dados'], JsonObject():New())
	oResponse['dados'][nLength]['de'] 	:= (cAlias)->MSG_REMET
	oResponse['dados'][nLength]['data'] := SubStr((cAlias)->MSG_DATA,7,2)+"/"+SubStr((cAlias)->MSG_DATA,5,2)+" - "+SUBSTR(TIME(),1,2)+":"+SUBSTR(TIME(),4,2) 
	oResponse['dados'][nLength]['msg']	:= (cAlias)->MSG_MSG
	DbSkip()
End
DbCloseArea()
oResponse['length'] := nLength
::SetResponse(FWJsonSerialize(oResponse, .F., .F., .T.))
Return .T.


//Retorna o vendedor
Static Function GetVendName(cName)
Local cRet := Posicione( "SA3",1,xFilial("SA3")+cName,"SA3->A3_NOME" )
Return cRet