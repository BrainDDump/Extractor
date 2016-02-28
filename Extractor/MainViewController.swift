//
//  MainViewController.swift
//  Extractor
//
//  Created by Кирилл on 2/27/16.
//  Copyright © 2016 BrainDump. All rights reserved.
//

import UIKit

class MainViewController: UIViewController {
    
    @IBOutlet weak var emptyNotice: UILabel!
    @IBOutlet weak var ancestorDataTextView: UITextView!
    @IBOutlet weak var newDataTextField:     UITextField!
    
    @IBOutlet weak var rejectButton: UIButton!
    @IBOutlet weak var submitButton: UIButton!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        
        /*if (ancestorDataTextView.text == ""){
            emptyNotice.hidden = false
        }*/
        configureView()
        loadNext()
        
        if (ancestorDataTextView.text != ""){
            emptyNotice.hidden = true
        }
    }
    
    func configureView() {
        self.submitButton.enabled = false
        self.rejectButton.enabled = false
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
                
                self.enableButtons()
                self.newDataTextField.text = ""
            }
        })
        
        if (ancestorDataTextView.text == ""){
            emptyNotice.hidden = false
        } else {
            emptyNotice.hidden = true
        }
    }
    
    @IBAction func rejectButtonPressed() {
        disableButtons()
        
        ServerManager.reject({
            (success) -> Void in
            self.loadNext()
        })
    }
    
    // MARK: - Helper methods
    func loadNext() {
        disableButtons()
        
        ServerManager.pull({
            (error, text) -> Void in
            if error != nil {
                print("Error occured while pulling data from server. Error: ", error)
                return
            }
            
            self.ancestorDataTextView.text = text
            self.enableButtons()
        })
    }
    
    func enableButtons() {
        submitButton.enabled = true
        rejectButton.enabled = true
    }
    
    func disableButtons() {
        submitButton.enabled = false
        rejectButton.enabled = false
    }
    
}

