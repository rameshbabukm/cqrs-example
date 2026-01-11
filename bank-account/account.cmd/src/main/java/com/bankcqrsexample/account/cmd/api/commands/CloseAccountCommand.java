package com.bankcqrsexample.account.cmd.api.commands;

import com.bankcqrsexample.cqrs.core.commands.BaseCommand;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class CloseAccountCommand extends BaseCommand {
    public CloseAccountCommand(String id) {
        super(id);
    }
}

