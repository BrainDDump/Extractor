//
//  SettingsViewController.swift
//  Extractor
//
//  Created by Rahul Shrestha on 2/27/16.
//  Copyright © 2016 BrainDump. All rights reserved.
//

import UIKit

class SettingsViewController: UIViewController, UITableViewDataSource,UITableViewDelegate {

    @IBOutlet var settingsTable: UITableView!
   
    // provides the number of section header titles
    let headerTitlesForSection = ["", " "," "]
    let rowData = [["User Info"],["Privacy Settings", "Info Settings", "Notification Settings"] , ["Log Out"]]
    
    override func viewDidLoad() {
        super.viewDidLoad()

        self.settingsTable.dataSource=self
        self.settingsTable.delegate=self
        
    }
    
    // provide the number of section to the table
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return headerTitlesForSection.count
    }
    
    // provide the number of rows in each section
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        return rowData[section].count
    }
    
    func tableView(tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        if section < headerTitlesForSection.count {
            return headerTitlesForSection[section]
        }
        
        return nil
    }
    
    
    // provide data for each section
   
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        
        let cell = UITableViewCell()
        
        cell.textLabel?.text = rowData[indexPath.section][indexPath.row]
        
        return cell
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        
        
    }


}
