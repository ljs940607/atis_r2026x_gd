<?xml version="1.0" encoding="UTF-8" ?>

<!-- 
	This operation is executed post installation of 3DEXPERIENCE On Premise Server (strictly by Lattice Administrator).
	Place the XML in the below location and restart the 3DSpace server : 
		${MATRIXINSTALL}/STAGING/ematrix/WEB-INF/resources/DerivedOutput/
	This Functionality will be available on R2021x FD06.
-->

<derivedformatmanagement xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="DerivedFormatDeclarative.xsd">
	<converter name="Elysium" synchronous="false" nlsFile="emxDerivedFormatManagementElysiumStringResource">
		<datasources>
			<datasource name="3DEXPERIENCE">
				<source name="CATPart" type="Part">
					<target name="XVL" inputStreamId="authoring" outputStreamId="XVL" />

					<target name="NX" inputStreamId="authoring" outputStreamId="NX" >
						<parameter name="Extension" values="prt" type="enum" default="prt" description="" mandatory="true"/>
					</target>
					
					<target name="Creo" inputStreamId="authoring" outputStreamId="CREO" >					
						<parameter name="Extension" values="prt" type="enum" default="prt" description="" mandatory="true"/>
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
					<target name="XVL" inputStreamId="authoring" outputStreamId="XVL" />
					
					<target name="NX" inputStreamId="authoring" outputStreamId="NX" >
						<parameter name="Extension" values="prt" type="enum" default="prt" description="" mandatory="true"/>
					</target>
					
					<target name="Creo" inputStreamId="authoring" outputStreamId="CREO" >					
						<parameter name="Extension" values="prt" type="enum" default="prt" description="" mandatory="true"/>
					</target>
				</source>
				<!-- new from 25xFD02/Jan2025: case of V5 CAProduct component with cgr as authoring -->
 				<source name="cgr" type="Part">
					<target name="XVL" inputStreamId="authoring" outputStreamId="XVL" >
						<parameter name="StreamFormat" values="XVL" type="enum" default="XVL" description="" mandatory="true"/>
						<parameter name="Extension" values="xv2" type="enum" default="xv2" description="" mandatory="true"/>
					</target>
				</source>              
                
				<events>
					<event name="promote"	type="Trigger"	maturityGraph="lifecycle" />
					<event name="ondemand" />
					<!-- planned in 23xFD01 - confirmed by SGD7 -->
					<event name="onXCADSave" />
				</events>
			</datasource>
			
            
            
			<!-- =============================== NX (from 22xFD06) =========================================================================================  -->
			<datasource name="NX">
				<source name="NX" type="Part">
					<target name="ExactGeometry" inputStreamId="authoring" outputStreamId="linkable"  downloadable="false" >
						<parameter name="Extension" values="prt" type="enum" default="prt" description="" mandatory="true"/>
					</target>
				</source>
                
				<events>
					<event name="promote"	type="Trigger"	maturityGraph="lifecycle" />
					<event name="ondemand" />
					<event name="onXCADSave"  />
				</events>
			</datasource>		



			<!-- =============================== Creo (from 22xFD06) =========================================================================================  -->
			<datasource name="CREO">
				<source name="Creo" type="Part">					
					<target name="ExactGeometry" inputStreamId="authoring" outputStreamId="linkable"  downloadable="false" >
						<parameter name="Extension" values="prt" type="enum" default="prt" description="" mandatory="true"/>
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
