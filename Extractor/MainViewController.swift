//
//  MainViewController.swift
//  Extractor
//
//  Created by Кирилл on 2/27/16.
//  Copyright © 2016 BrainDump. All rights reserved.
//

import UIKit

class MainViewController: UIViewController {
    
    @IBOutlet weak var ancestorDataTextView: UITextView!
    @IBOutlet weak var newDataTextField:     UITextField!
    
    @IBOutlet weak var rejectButton: UIButton!
    @IBOutlet weak var submitButton: UIButton!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        loadNext()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func submitButtonPressed() {
        if newDataTextField.text! == "" {
            return
        }
        
        submitButton.enabled = false
        let newData = newDataTextField.text!
        ServerManager.push(newData, handler: {
            (success) -> Void in
            if success {
                self.loadNext()
                
                self.submitButton.enabled = true
                self.newDataTextField.text = ""
            }
        })
    }
    
    @IBAction func rejectButtonPressed() {
        
    }
    

    // MARK: - Helper methods
    func loadNext() {
        ServerManager.pull({
            (error, text) -> Void in
            if error != nil {
                print("Error occured while pulling data from server. Error: ", error)
                return
            }
            
            self.ancestorDataTextView.text = text
        })
    }
    
}

