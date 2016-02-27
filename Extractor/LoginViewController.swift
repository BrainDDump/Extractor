//
//  LoginViewController.swift
//  Extractor
//
//  Created by Кирилл on 2/27/16.
//  Copyright © 2016 BrainDump. All rights reserved.
//

import UIKit
import ParseFacebookUtilsV4

class LoginViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    
    @IBAction func facebookLoginButtonPressed() {
        let permissions = ["public_profile"]
        PFFacebookUtils.logInInBackgroundWithReadPermissions(permissions, block: {
            (user, error) -> Void in
            if error != nil {
                print("Error occured while logging in with facebook. Error: ", error)
                return
            }
            
            print(user)
            
            let appDel = UIApplication.sharedApplication().delegate as! AppDelegate
            appDel.tryToLoadMainApp()
        })
    }
    

}
