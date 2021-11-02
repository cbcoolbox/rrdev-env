import * as React from "react";

interface IComponentProps {
    name: string;
}

type ComponentState = {
    tables: Table[];
    selectedTable: number;
    selectedField: number;
    showAddTable: boolean;
    showAddField: boolean;
}

type Table = {
    tableName: string;
    fields: Field[];
}

type Field = {
    fieldName: string;
    type: string;
}

// type table

export default class Component extends React.Component <{}, ComponentState> {
    constructor(props:object) {
        super(props);
        const newState: ComponentState = { 
            tables: [], 
            selectedTable: null, 
            selectedField: null,
            showAddTable: false,
            showAddField: false
        };
        this.state = newState;
    }

    componentDidMount() {
        postData("/builder", {command: "explainDB"}).then((data) => {
            this.setState({tables: data});
        });
    }

    getData() {
        postData('/api', {"query": "query { users(id:2) firstName(renderValue:value), lastName, payments { products_id }}"}).then(data => {
            console.log("successful", data);
        }).catch(err => {
            console.log("error", err);
        });
    }

    addTable() {
        let data = {
            tableName: (document.getElementById("newTableName") as HTMLInputElement).value
        };

        postData("/builder", {command: "addTable", data}).then((data) => {
            this.setState({tables: data, showAddTable: false, selectedField: null});
        });
    }

    addField() {
        let data = {
            table: this.state.selectedTable, 
            fieldName: (document.getElementById("newFieldName") as HTMLInputElement).value,
            fieldType: (document.getElementById("newFieldType") as HTMLInputElement).value
        };

        postData("/builder", {command: "addField", data}).then((data) => {
            this.setState({tables: data, showAddField: false, selectedField: null});
        });
    }

    selectTable(tableIndex:number) {
        this.setState({...this.state, selectedTable: tableIndex});
    }

    selectField(fieldIndex:number) {
        this.setState({...this.state, selectedField: fieldIndex});
    }

    showAddTable() {
        this.setState({...this.state, showAddTable: true});
    }

    showAddField() {
        this.setState({...this.state, showAddField: true});
    }

    render() {
        return (
            <div style={{"fontFamily": "Roboto", "padding": "30px"}}>
                <h1>Make a Database!</h1>
                <div style={{"display": "flex", "flexDirection": "column"}}>
                    <div style={{"height": "100px"}}>
                        <div style={{"display": "flex", "alignItems": "center"}}>
                            <h3>Tables</h3> 
                            <div onClick={() => {this.showAddTable()}} style={{"margin": "8px", "cursor": "pointer"}}>
                                <i className="fas fa-plus-square" style={{"marginLeft": "10px", "fontSize": "20px", "color": "#6ce362"}}></i>
                            </div>
                        </div>
                        <div style={{"display": "flex"}}>
                            {this.state.tables.map((table, index) => {
                                return (
                                    <div onClick={() => {this.selectTable(index)}} key={"table-" + index} style={{"margin": "5px", "padding": "8px", "backgroundColor": "#6ce362", "cursor": "pointer"}}>
                                        {table.tableName}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div style={{"display": "flex"}}>
                        <div>
                            <div style={{"display": "flex", "alignItems": "center"}}>
                                <h3>Fields</h3> 
                                {this.state.selectedTable != null && <div onClick={() => {this.showAddField()}} style={{"margin": "8px", "cursor": "pointer"}}>
                                    <i className="fas fa-plus-square" style={{"marginLeft": "10px", "fontSize": "20px", "color": "#6ce362"}}></i>
                                </div>}
                            </div>
                            {this.state.selectedTable != null 
                            && this.state.tables[this.state.selectedTable].fields.map((field, index) => {
                                return (
                                    <div onClick={() => {this.selectField(index)}} key={"field-"+index} style={{"margin": "3px", "padding": "8px", "backgroundColor": "#6ce362", "cursor": "pointer"}}>
                                        {field.fieldName}
                                    </div>
                                )
                            })}
                        </div>
                        <div style={{"marginLeft": "20px"}}>
                            <h3>Arguments</h3>
                            {this.state.selectedField != null 
                            && 
                            <div style={{"display": "flex"}}>
                                <div style={{"margin": "3px", "padding": "8px", "backgroundColor": "#6279e3"}}>Type</div> 
                                <div style={{"padding": "8px"}}>=</div>
                                <div style={{"margin": "3px", "padding": "8px", "backgroundColor": "#6279e3"}}>{this.state.tables[this.state.selectedTable].fields[this.state.selectedField].type}</div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
                {/* New table dialog */}
                {this.state.showAddTable && <div style={{"boxShadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)","position": "absolute", "left": "50%", "top": "30%", "transform": "translate(-50%, -30%)", "padding": "10px"}}>
                    <div style={{"display": "flex", "justifyContent": "space-between"}}>
                        <h3>Add a new Table</h3>
                        <i className="fas fa-times" onClick={()=> {this.setState({...this.state, "showAddTable": false})}} style={{"alignSelf": "center", "cursor": "pointer"}}></i>
                    </div>
                    <div>
                        <input placeholder="Table Name" style={{"padding": "3px"}} id="newTableName" />
                        <div style={{"display": "flex", "justifyContent": "flex-end"}}>
                            <div onClick={()=> {this.addTable()}} style={{"cursor": "pointer", "marginTop": "20px", "padding": "8px", "backgroundColor": "#6279e3"}}>Save</div>
                        </div>
                    </div>
                </div>}
                {/* New field dialog */}
                {this.state.showAddField && <div style={{"boxShadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)","position": "absolute", "left": "50%", "top": "30%", "transform": "translate(-50%, -30%)", "padding": "10px"}}>
                    <div style={{"display": "flex", "justifyContent": "space-between"}}>
                        <h3>Add a new Field to: {this.state.tables[this.state.selectedTable].tableName}</h3>
                        <i className="fas fa-times" onClick={()=> {this.setState({...this.state, "showAddField": false})}} style={{"marginLeft": "20px", "alignSelf": "center", "cursor": "pointer"}}></i>
                    </div>
                    <div>
                        <input placeholder="Field Name" style={{"margin": "5px", "padding": "3px"}} id="newFieldName" />
                        <br />
                        <input placeholder="Field Type" style={{"margin": "5px", "padding": "3px"}} id="newFieldType" />
                        <div style={{"display": "flex", "justifyContent": "flex-end"}}>
                            <div onClick={()=> {this.addField()}} style={{"cursor": "pointer", "marginTop": "20px", "padding": "8px", "backgroundColor": "#6279e3"}}>Save</div>
                        </div>
                    </div>
                </div>}
            </div>
        );
    }
}

// Example POST method implementation:
async function postData(url:string = '', data:object = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    return response.json(); // parses JSON response into native JavaScript objects
}