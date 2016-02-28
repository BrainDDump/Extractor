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
        decorateButton(emailSignUpButton, color: UIColor(red: 255/255.0, green: 255/255.0, blue: 255/255.0, alpha: 1))
      
    }
    
    @IBOutlet weak var usernameField: UITextField!
    @IBOutlet weak var passwordField: UITextField!
    
    @IBAction func unwindToLogin(sender: UIStoryboardSegue){
    }
    
    @IBOutlet weak var facebookLoginButton: UIButton!
    
    @IBOutlet weak var emailSignUpButton: UIButton!
    
 
    private func decorateButton(button: UIButton, color: UIColor) {
        
        if(button==facebookLoginButton){
            button.setTitleColor(UIColor.whiteColor(), forState: UIControlState.Normal)
        } else {
            button.setTitleColor(UIColor(red: 0.961, green: 0.231, blue: 0.231, alpha: 1), forState: UIControlState.Normal)
        }
        
        button.layer.borderColor = color.CGColor
        button.backgroundColor = color;
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
