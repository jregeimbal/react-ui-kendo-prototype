import React from 'react'

import 'normalize.css/normalize.css'
import 'styles/App.css'

import KendoUI from 'kendo-ui-react'

// this.$elem.empty() was causing button to break on redraw, may need to fork kendo-ui-react
KendoUI.Button.prototype.componentDidUpdate = function () {
      if (this.props.debug) console.log('didUpdate kendo widget', widget);
      if (this.props.debug) console.log('new options:', this.props.options);

      if (!this.props.reactive) return;

      if (this.props.debug) console.log('[', widget, '] refreshing "reactive" widget...');

      this.$widget.unbind();
      if (this.$widget.element) {
        kendo.destroy(this.$widget);
      }
      if (this.$widget.dataSource) {
        this.$widget.dataSource.unbind('change', this.$widget._refreshHandler);
        this.$widget.dataSource.unbind('error', this.$widget._errorHandler);
      }

      function mountKendoWidget (component, widget) {
		component.$elem[widget](component.props.options);
		return component.$elem.data(widget);
	  }

      //this.$elem.empty();
      this.$widget = mountKendoWidget(this, 'kendoButton');
}



var movies = [
    { "rank": 1,  "rating": 9.2, "year": 1994, "title": "The Shawshank Redemption" },
    { "rank": 2,  "rating": 9.2, "year": 1972, "title": "The Godfather" },
    { "rank": 3,  "rating": 9,   "year": 1974, "title": "The Godfather: Part II" },
    { "rank": 4,  "rating": 8.9, "year": 1966, "title": "Il buono, il brutto, il cattivo." },
    { "rank": 5,  "rating": 8.9, "year": 1994, "title": "Pulp Fiction" },
    { "rank": 6,  "rating": 8.9, "year": 1957, "title": "12 Angry Men" },
    { "rank": 7,  "rating": 8.9, "year": 1993, "title": "Schindler's List" },
    { "rank": 8,  "rating": 8.8, "year": 1975, "title": "One Flew Over the Cuckoo's Nest" },
    { "rank": 9,  "rating": 8.8, "year": 2010, "title": "Inception" },
    { "rank": 10, "rating": 8.8, "year": 2008, "title": "The Dark Knight" }
];

var dataSource = new kendo.data.DataSource({
    data: movies//,
    // change: function() { // subscribe to the CHANGE event of the data source
    //     $("#movies tbody").html(kendo.render(template, this.view())); // populate the table
    // }
});

var provider_columns = [
	{
		field: "title" ,
		title: "Title",
		width: "",
		attributes: {'class': 'grid_cell'},
		headerAttributes: {'class': 'grid_header'},
	},
	{
		field: "rank" ,
		title: "Rank",
		width: "10%",
		attributes: {'class': 'grid_cell grid_number'},
		headerAttributes: {'class': 'grid_header grid_number'}
		//template: "#if(total_count < 11){# < 11 #}else{# #: kendo.toString(total_count, 'n0') # #}#"
	}
];
 
class AppComponent extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			provider_columns: [
				{
					field: "title" ,
					title: "Title",
					width: "",
					attributes: {'class': 'grid_cell'},
					headerAttributes: {'class': 'grid_header'},
				},
				{
					field: "rank" ,
					title: "Rank",
					width: "10%",
					attributes: {'class': 'grid_cell grid_number'},
					headerAttributes: {'class': 'grid_header grid_number'}
					//template: "#if(total_count < 11){# < 11 #}else{# #: kendo.toString(total_count, 'n0') # #}#"
				}
			]
		}
	}

	isShowingMore(){
		var result = this.state.provider_columns.filter(function(d) {
		    return d.field === 'rating'
		});

		return result && result.length;
	}

	_handleToggleMore(){
		var providerColumns = this.state.provider_columns;

		// If result then remove them
		if (this.isShowingMore()) {
			providerColumns = providerColumns.filter(function (el) {
                return el.field !== "rating" && el.field !== "year"
            })
        // Otherwise add them
		} else {
			providerColumns = providerColumns.concat(
				{
					field: "rating" ,
					title: "Rating",
					width: "10%",
					attributes: {'class': 'grid_cell grid_number'},
					headerAttributes: {'class': 'grid_header grid_number'}
					//template: "#if(total_count < 11){# < 11 #}else{# #: kendo.toString(total_count, 'n0') # #}#"
				},
				{
					field: "year" ,
					title: "Year",
					width: "10%",
					attributes: {'class': 'grid_cell grid_number'},
					headerAttributes: {'class': 'grid_header grid_number'}
					//template: "#if(total_count < 11){# < 11 #}else{# #: kendo.toString(total_count, 'n0') # #}#"
				}
			)
		}

		this.setState({
			provider_columns: [].concat(providerColumns)
		})
	}

	_handleAddMoreData(){
		movies.forEach((dataItem) => {
			dataSource.add(dataItem);
		})
	}

	render() {
		console.log(this.state.provider_columns);
		var splitterOptions = {
		  orientation: 'horizontal',
		  panes: [
		    { collapsible: false, size: '450px' },
		    { resizable: true }
		  ]
		};
		var treeOptions = { /* ... */ };
		var gridOptions = { 
			scrollable: false,
			sortable: true,
			columns: this.state.provider_columns,
			dataSource: dataSource,
			dataBound: function(e) {
			}
		};
		var splitterStyle = {
			height: '450px'
		}
		console.log(gridOptions);
		return (
			<div>
			  <KendoUI.Splitter options={splitterOptions} style={splitterStyle}>
			    <KendoUI.TreeView options={treeOptions} />
			    <KendoUI.Grid reactive options={gridOptions} />
			  </KendoUI.Splitter>
			  <KendoUI.Button reactive onClick={this._handleToggleMore.bind(this)}>{this.isShowingMore() ? 'Hide Columns' : 'Show Columns'}</KendoUI.Button>
			  <KendoUI.Button reactive onClick={this._handleAddMoreData.bind(this)}>Add More Data</KendoUI.Button>
			</div>
		);
	}
}


AppComponent.defaultProps = {
};

export default AppComponent;
