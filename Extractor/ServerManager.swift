//
//  ServerManager.swift
//  Extractor
//
//  Created by Кирилл on 2/27/16.
//  Copyright © 2016 BrainDump. All rights reserved.
//

import Foundation
import Parse

class ServerManager {
    typealias TextResponseBlock = (error: NSError?, text: String?) -> Void
    typealias SuccessResponceBlock = (success: Bool) -> Void

    private static var parentNode: Node?
    
    class func pull(handler: TextResponseBlock) {
        PFCloud.callFunctionInBackground("pull", withParameters: nil, block: {
            (data, error) -> Void in
            if error != nil {
                print("pull was not successfull. Error: ", error)
                
                handler(error: error, text: nil)
                return
            }
            
            let nodes = data as! [Node]
            self.parentNode = nodes.last
            
            var textFromNodes = ""
            for node in nodes {
                textFromNodes += node.content
            }
            
            handler(error: nil, text: textFromNodes)
        })
    }
    
    class func push(data: String, handler: SuccessResponceBlock) {
        let newNode = Node()
        newNode.parent = parentNode
        newNode.child  = nil
        
        newNode.owner   = PFUser.currentUser()!
        newNode.content = data
        
        let parameters: [NSObject: AnyObject] = [
            "parentNode": parentNode != nil ? parentNode! : "none",
            "newNode":    newNode
        ]
        PFCloud.callFunctionInBackground("push", withParameters: parameters, block: {
            (data, error) -> Void in
            if error != nil {
                print("push was not successfull. Error: ", error)
                
                handler(success: false)
                return
            }
            
            handler(success: true)
        })
    }
    
    // MARK: - Test
    class func getFreeNode() {
        PFCloud.callFunctionInBackground("getFreeNode", withParameters: nil, block: {
            (data, error) -> Void in
            if error != nil {
                print("getFreeNode was not successfull. Error: ", error)
                return
            }
            
            print(data)
        })
    }
}
