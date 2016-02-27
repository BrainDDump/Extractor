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

        decorateButton(facebookLoginButton,color: UIColor(red: 0.231, green: 0.349, blue: 0.596, alpha: 1.0) )
      
    }
    @IBOutlet weak var facebookLoginButton: UIButton!
    
    private func decorateButton(button: UIButton, color: UIColor) {
        
        button.setTitleColor(UIColor.whiteColor(), forState: UIControlState.Normal)
        button.layer.borderColor = color.CGColor
        button.backgroundColor = UIColor(red: 0.231, green: 0.349, blue: 0.596, alpha: 1.0)
        button.layer.borderWidth = 2
        button.layer.cornerRadius = 7
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
