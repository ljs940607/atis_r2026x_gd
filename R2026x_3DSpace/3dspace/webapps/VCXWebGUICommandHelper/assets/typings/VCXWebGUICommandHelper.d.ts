
type commandHelperStartEvent = {
    numberSteps?: number,
    message?: string,
    noLabel?: boolean,
    infoMessage?: string
}

interface coordinatePosition {
    value: number,
    isAbsolute: boolean,
    reference: 'top' | 'left' | 'bottom' | 'right'
}

type commandHelperEndEvent = {}

type commandHelperWarnEvent = {}

type commandHelperNextEvent = {
    numberSteps?: number,
    message?: string
}

type commandHelperPreviousEvent = {}

type commandHelperDataEvent = {
    id?: string,
    name?: string,
    requestedStep?: any,
    options: commandHelperStartEvent    |
             commandHelperEndEvent      | 
             commandHelperNextEvent     | 
             commandHelperPreviousEvent |
             commandHelperWarnEvent
}
