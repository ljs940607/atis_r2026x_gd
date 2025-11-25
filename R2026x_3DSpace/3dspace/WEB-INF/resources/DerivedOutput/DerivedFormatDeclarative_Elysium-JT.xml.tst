<?xml version="1.0" encoding="UTF-8" ?>

<!-- 
	This operation is executed post installation of 3DEXPERIENCE on "On Premise" Server (strictly/only by a trained Administrator) : 
	Place this XML in the below location and restart the 3DSpace server : 
		${MATRIXINSTALL}/STAGING/ematrix/WEB-INF/resources/DerivedOutput/DerivedFormatDeclarative_Elysium.xml
	This file is a prototype for test purpose only, integration of a partner requires a PID and collaboration with RnD team to converge
	CARREFUL : all fields are case sensitive, do not try supranatural experience with changing values
-->

<derivedformatmanagement xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="DerivedFormatDeclarative.xsd">
	<converter name="Elysium" synchronous="false" nlsFile="emxDerivedFormatManagementElysiumStringResource">
		<datasources>
			<datasource name="3DEXPERIENCE">
				<source name="CATPart" type="Part">
					<target name="JT" inputStreamId="authoring" outputStreamId="JT" downloadable="true" >
						<parameter name="Extension" values="jt" type="enum" default="jt" description="Elysium 3DEXP to JT" mandatory="true"/>
					</target>
					
					<target name="STL" inputStreamId="authoring" outputStreamId="STL" downloadable="true" >
						<parameter name="Extension" values="stl" type="enum" default="stl" description="Elysium 3DEXP to STL" mandatory="true"/>
					</target>
					
				</source>
                
				<events>
					<event name="checkin"	type="Trigger" />
					<event name="promote"	type="Trigger"	maturityGraph="lifecycle" />
					<event name="ondemand" />
				</events>
			</datasource>
			
			<datasource name="CATIAV5">
				<source name="CATPart" type="Part">					
					<target name="JT" inputStreamId="authoring" outputStreamId="JT" downloadable="true" >
						<parameter name="Extension" values="jt" type="enum" default="jt" description="Elysium CV5 to JT" mandatory="true"/>
					</target>
					
					<target name="STL" inputStreamId="authoring" outputStreamId="STL" downloadable="true" >
						<parameter name="Extension" values="stl" type="enum" default="stl" description="Elysium CV5 to STL" mandatory="true"/>
					</target>
					
				</source>
                
				<events>
					<event name="promote"	type="Trigger"	maturityGraph="lifecycle" />
					<event name="ondemand" />
					<event name="onXCADSave" />
				</events>
			</datasource>
			
            
            
			<!-- =============================== NX =========================================================================================  -->
			<datasource name="NX">
				<source name="NX" type="Part">
					<target name="JT" inputStreamId="authoring" outputStreamId="JT"  downloadable="true" >
						<parameter name="Extension" values="jt" type="enum" default="jt" description="Elysium NX to JT" mandatory="true"/>
					</target>
					
					<target name="STL" inputStreamId="authoring" outputStreamId="STL" downloadable="true" >
						<parameter name="Extension" values="stl" type="enum" default="stl" description="Elysium NX to STL" mandatory="true"/>
					</target>
					
				</source>
                
				<events>
					<event name="promote"	type="Trigger"	maturityGraph="lifecycle" />
					<event name="ondemand" />
					<event name="onXCADSave"  />
				</events>
			</datasource>		



			<!-- =============================== Creo =========================================================================================  -->
			<datasource name="CREO">
				<source name="Creo" type="Part">					
					<target name="JT" inputStreamId="authoring" outputStreamId="JT"  downloadable="true" >
						<parameter name="Extension" values="jt" type="enum" default="jt" description="Elysium CREO to JT" mandatory="true"/>
					</target>
					
					<target name="STL" inputStreamId="authoring" outputStreamId="STL" downloadable="true" >
						<parameter name="Extension" values="stl" type="enum" default="stl" description="Elysium CREO to STL" mandatory="true"/>
					</target>
					
				</source>
                
				<events>
					<event name="promote"	type="Trigger"	maturityGraph="lifecycle" />
					<event name="ondemand" />
					<event name="onXCADSave" />
				</events>
			</datasource>		
            
            
		</datasources>
	</converter>
     
</derivedformatmanagement>
