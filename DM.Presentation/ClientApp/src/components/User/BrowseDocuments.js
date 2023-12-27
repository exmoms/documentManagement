import React, { Component } from "react";
import DocumentTable from "./DocumentTable";
import SearchDocuments from "./SearchDocuments";

export class BrowseDocuments extends Component {
  constructor() {
    super();
    this.state = { data: [], columns: [] };
  }

  getDocumentList = (list, columns = this.state.columns) => {
    this.setState({
      data: list,
      columns: columns,
    });
  };

  render() {
    return (
      <div>
        <SearchDocuments
          getDocumentList={this.getDocumentList}
          action="browse-document"
        />
        <DocumentTable
          data={this.state.data}
          columns={this.state.columns}
          action="browse-document"
          updateTableData={this.getDocumentList}
        />
      </div>
    );
  }
}

export default BrowseDocuments;
