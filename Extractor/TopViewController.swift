//
//  TopViewController.swift
//  Extractor
//
//  Created by Кирилл on 2/28/16.
//  Copyright © 2016 BrainDump. All rights reserved.
//

import UIKit

class TopViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        ServerManager.loadMyLastContributions {
            (error, texts) -> Void in
            
            print("loadMyLastContributions", error, texts)
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}
