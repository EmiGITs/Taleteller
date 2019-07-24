# coding=utf-8
from lxml import etree
import difflib
from mydifflib import get_close_matches_indexes

doc = etree.parse("PrototipoPython/Prototipo.xml")
##articles = doc.find("option[@name='TEXTOA-A']")
##articles2=articles.findall("option")
##for option in articles2:
    ##print(option[0].text)


def Explorar(doc):
	print("Bienvenido")
	print("La historia comienza así:")
	print(MostrarInicial(doc))
	Eleccion = MostrarOpcionesInicial(doc)
	Status = getStatus(doc,Eleccion)
	Explorar2(doc,Eleccion,Status)


def Explorar2(doc,Eleccion,Status):
	if Status != "End":
		articles = doc.find("option[@name='"+Eleccion+"']")
		nea=articles.find("textolargo")
		print(nea.text)
		Eleccion=MostrarOpcionesMisc(doc,Eleccion)
		Status = getStatus(articles,Eleccion)
		Explorar2(articles,Eleccion,Status)
	else:
		articles = doc.find("option[@name='"+Eleccion+"']")
		nea=articles.find("textolargo")
		print(nea.text)

def getStatus(doc,Eleccion):
	articles = doc.find("option[@name='"+Eleccion+"']")
	nea=articles.find("stag")
	return nea.text

    
def MostrarInicial(doc):
    raiz=doc.getroot()
    texto=raiz.find("textolargo")
    return(texto.text)


def MostrarOpcionesInicial(doc):
	IdList=[]
	OpcionesList = []
	raiz=doc.getroot()
	opciones=raiz.findall("option")
	for option in opciones:
		IdList.append(option.attrib['name'])
	for option in opciones:
		option.find("textocorto")
		OpcionesList.append(option[0].text)
	print(OpcionesList)
	opcion = input("Decisión: ")
	nea = get_close_matches_indexes(opcion,OpcionesList)
	if not nea:
		return "Opción invalida"
	else:
		return IdList[nea[0]]
def MostrarOpcionesMisc(doc,Eleccion):
	IdList=[]
	OpcionesList=[]
	raiz=doc.find("option[@name='"+Eleccion+"']")
	opciones=raiz.findall("option")
	for option in opciones:
		IdList.append(option.attrib['name'])
	for option in opciones:
		option.find("textocorto")
		OpcionesList.append(option[0].text)
	print(OpcionesList)
	opcion = input("Decisión: ")
	nea = get_close_matches_indexes(opcion,OpcionesList)
	if not nea:
		return "Opción invalida"
	else:
		return IdList[nea[0]]
Explorar(doc)
