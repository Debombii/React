# LogGenerator

Este proyecto es la interfaz frontend de un sistema generador de logs, que consta de dos componentes: un frontend (este repositorio) y un backend basado en Flask. El objetivo de este sistema es generar y gestionar logs dinámicos utilizando plantillas personalizadas para distintas empresas.

## Backend

Puedes encontrar el código del backend en el siguiente repositorio:  
[Flask Backend - Log Generator](https://github.com/Debombii/Flask)

## ¿Cómo funciona?

El flujo de trabajo de **LogGenerator** se compone de los siguientes pasos:

1. **Generación de HTML en el frontend**:  
   El frontend genera el código HTML necesario para el cuerpo de las plantillas ubicadas en el directorio `public`.

2. **Comunicación con el backend**:  
   El contenido HTML generado se envía al backend, que es el encargado de procesar y gestionar los logs.

3. **Procesamiento en el backend**:  
   El backend introduce el contenido HTML recibido dentro de plantillas específicas para cada empresa, siguiendo una estructura predeterminada:
   - **Índice único**: Se añade un índice con una ID única a cada nuevo registro.
   - **Contenido vinculado**: El contenido generado se inserta en el cuerpo (`body`) de la plantilla, asociado con la ID del índice.
   - **Actualización de registros**: Los nuevos registros se colocan siempre encima de los anteriores, manteniendo el historial completo en orden descendente.

## Estructura del Proyecto

Este repositorio contiene la parte frontend del proyecto, responsable de la generación de contenido HTML y la comunicación con el backend. Para más detalles sobre el procesamiento y la lógica de backend, revisa el [repositorio de Flask](https://github.com/Debombii/Flask).

## Creación de nuevo Proyecto/Empresa

Es muy probable que necesites crear un nuevo proyecto y por lo tanto una gestión de una nueva plantilla. **Pero no hay ningún problema** ya que he gestionado el código para que con solo 7 pasos puedas crear tu nueva entrada sin problemas, [En esta guía](https://docs.google.com/document/d/1FJkGZeFGGX6IhcqQpkYy2j4xcTR6P78GvKSfRUwdbt4/edit?usp=sharing).
